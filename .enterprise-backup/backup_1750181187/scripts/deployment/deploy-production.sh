#!/bin/bash
# Production Deployment Script with Blue-Green Strategy
# This script orchestrates a zero-downtime blue-green deployment

set -e

# Configuration
DEPLOYMENT_ID=$(date +%Y%m%d%H%M%S)
ENVIRONMENT="production"
NAMESPACE="hms"
KUBECONFIG_PATH="${KUBECONFIG:-~/.kube/config}"
REGISTRY="hms-registry.example.com"
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
DEPLOYMENT_LOG="deployment-${DEPLOYMENT_ID}.log"
HEALTH_CHECK_RETRIES=30
HEALTH_CHECK_DELAY=10

# Service names
SERVICES=(
  "frontend-service"
  "api-gateway"
  "patient-service"
  "appointment-service" 
  "billing-service"
  "pharmacy-service"
  "laboratory-service"
  "analytics-service"
  "cdss-service"
  "auth-service"
)

# Function to log messages
log() {
  local message="$1"
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  echo "[$timestamp] $message" | tee -a "$DEPLOYMENT_LOG"
  
  # Send to Slack if webhook is configured
  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -s -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"[$ENVIRONMENT] $message\"}" \
      "$SLACK_WEBHOOK_URL" > /dev/null
  fi
}

# Function to check if a command exists
command_exists() {
  command -v "$1" > /dev/null 2>&1
}

# Function to validate prerequisites
validate_prerequisites() {
  log "Validating prerequisites..."
  
  if ! command_exists kubectl; then
    log "ERROR: kubectl is not installed. Please install kubectl and try again."
    exit 1
  fi
  
  if ! command_exists argocd; then
    log "ERROR: argocd CLI is not installed. Please install argocd and try again."
    exit 1
  fi
  
  if ! command_exists helm; then
    log "ERROR: helm is not installed. Please install helm and try again."
    exit 1
  }
  
  # Check kubectl connectivity
  if ! kubectl --kubeconfig="$KUBECONFIG_PATH" get ns > /dev/null 2>&1; then
    log "ERROR: Unable to connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
  fi
  
  # Check if namespace exists
  if ! kubectl --kubeconfig="$KUBECONFIG_PATH" get ns "$NAMESPACE" > /dev/null 2>&1; then
    log "ERROR: Namespace $NAMESPACE does not exist."
    exit 1
  }
  
  log "Prerequisites validation completed successfully."
}

# Function to run pre-deployment validation
run_validation() {
  log "Running pre-deployment validation..."
  
  # Run validation script
  bash ./scripts/validation/run-full-validation.sh
  
  if [ $? -ne 0 ]; then
    log "ERROR: Pre-deployment validation failed. Aborting deployment."
    exit 1
  }
  
  log "Pre-deployment validation completed successfully."
}

# Function to build and push Docker images
build_and_push_images() {
  log "Building and pushing Docker images..."
  
  for service in "${SERVICES[@]}"; do
    log "Building image for $service..."
    
    # Determine build context and Dockerfile
    case "$service" in
      "frontend-service")
        CONTEXT="."
        DOCKERFILE="Dockerfile"
        IMAGE_TAG="${REGISTRY}/frontend:${DEPLOYMENT_ID}"
        ;;
      "api-gateway")
        CONTEXT="./apps/api-gateway"
        DOCKERFILE="Dockerfile"
        IMAGE_TAG="${REGISTRY}/api-gateway:${DEPLOYMENT_ID}"
        ;;
      *)
        CONTEXT="./apps/microservices/$(echo $service | sed 's/-service//')"
        DOCKERFILE="Dockerfile"
        IMAGE_TAG="${REGISTRY}/$(echo $service | sed 's/-service//'):${DEPLOYMENT_ID}"
        ;;
    esac
    
    # Build and push
    docker build -t "$IMAGE_TAG" -f "$CONTEXT/$DOCKERFILE" "$CONTEXT"
    docker push "$IMAGE_TAG"
    
    # Tag as latest
    LATEST_TAG="${IMAGE_TAG%:*}:latest"
    docker tag "$IMAGE_TAG" "$LATEST_TAG"
    docker push "$LATEST_TAG"
    
    log "Successfully built and pushed image for $service: $IMAGE_TAG"
  done
  
  log "All images built and pushed successfully."
}

# Function to update image tags in Kubernetes manifests
update_image_tags() {
  log "Updating image tags in Kubernetes manifests..."
  
  for service in "${SERVICES[@]}"; do
    case "$service" in
      "frontend-service")
        IMAGE_NAME="frontend"
        ;;
      *)
        IMAGE_NAME=$(echo $service | sed 's/-service//')
        ;;
    esac
    
    IMAGE_TAG="${REGISTRY}/${IMAGE_NAME}:${DEPLOYMENT_ID}"
    
    # Update ArgoCD application
    argocd app set "hms-${service}" --kustomize-image="${IMAGE_TAG}"
    
    log "Updated image tag for $service to $IMAGE_TAG"
  done
  
  log "All image tags updated successfully."
}

# Function to switch traffic for blue-green deployment
switch_traffic() {
  local service=$1
  log "Switching traffic for $service (blue-green)..."
  
  # Get current rollout status
  kubectl --kubeconfig="$KUBECONFIG_PATH" -n "$NAMESPACE" get rollout "$service" -o jsonpath='{.status.currentPodHash}' > /dev/null
  
  # Promote the rollout
  kubectl --kubeconfig="$KUBECONFIG_PATH" -n "$NAMESPACE" argo rollouts promote "$service"
  
  # Wait for promotion to complete
  kubectl --kubeconfig="$KUBECONFIG_PATH" -n "$NAMESPACE" argo rollouts status "$service" --watch
  
  log "Traffic switched successfully for $service."
}

# Function to run smoke tests after deployment
run_smoke_tests() {
  log "Running smoke tests..."
  
  # Run smoke test script
  npx jest --config=jest.smoke.config.js --ci
  
  if [ $? -ne 0 ]; then
    log "ERROR: Smoke tests failed. Rolling back..."
    rollback_deployment
    exit 1
  }
  
  log "Smoke tests passed successfully."
}

# Function to check health of deployed services
check_services_health() {
  log "Checking health of deployed services..."
  
  for service in "${SERVICES[@]}"; do
    log "Checking health of $service..."
    
    for ((i=1; i<=$HEALTH_CHECK_RETRIES; i++)); do
      # Get service endpoint
      if [[ "$service" == "frontend-service" ]]; then
        ENDPOINT="https://app.hms.health"
      else
        ENDPOINT="https://api.hms.health/health/$service"
      fi
      
      # Check health
      HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$ENDPOINT")
      
      if [[ "$HTTP_STATUS" == "200" ]]; then
        log "$service is healthy."
        break
      else
        log "Health check attempt $i for $service failed (HTTP $HTTP_STATUS)."
        
        if [[ "$i" == "$HEALTH_CHECK_RETRIES" ]]; then
          log "ERROR: $service failed health checks. Rolling back..."
          rollback_deployment
          exit 1
        fi
        
        log "Retrying in $HEALTH_CHECK_DELAY seconds..."
        sleep $HEALTH_CHECK_DELAY
      fi
    done
  done
  
  log "All services are healthy."
}

# Function to rollback the deployment if something goes wrong
rollback_deployment() {
  log "ROLLING BACK DEPLOYMENT..."
  
  # Rollback ArgoCD applications
  for service in "${SERVICES[@]}"; do
    argocd app rollback "hms-${service}"
    log "Rolled back $service."
  done
  
  log "Rollback completed."
}

# Function to update documentation
update_documentation() {
  log "Updating documentation..."
  
  # Record deployment in deployment history
  echo "- Deployment ID: ${DEPLOYMENT_ID}" >> ./docs/deployment-history.md
  echo "  Date: $(date)" >> ./docs/deployment-history.md
  echo "  Services: ${SERVICES[*]}" >> ./docs/deployment-history.md
  echo "  Status: Successful" >> ./docs/deployment-history.md
  echo "" >> ./docs/deployment-history.md
  
  log "Documentation updated."
}

# Function to notify stakeholders
notify_stakeholders() {
  log "Notifying stakeholders about successful deployment..."
  
  # Send email
  if command_exists mail; then
    RECIPIENTS="devops@hms.health,management@hms.health"
    SUBJECT="HMS Deployment ${DEPLOYMENT_ID} Completed Successfully"
    BODY="The deployment ${DEPLOYMENT_ID} to ${ENVIRONMENT} has been completed successfully.\n\nDeployed services: ${SERVICES[*]}\n\nDeployment log: ${DEPLOYMENT_LOG}"
    
    echo -e "$BODY" | mail -s "$SUBJECT" "$RECIPIENTS"
  fi
  
  # Slack notification sent by log function
  log "DEPLOYMENT SUCCESSFUL: HMS ${ENVIRONMENT} deployment ${DEPLOYMENT_ID} completed."
}

# Main deployment flow
main() {
  log "Starting production deployment ${DEPLOYMENT_ID}..."
  
  # Create deployment directory
  mkdir -p deployments/${DEPLOYMENT_ID}
  
  # Validate prerequisites
  validate_prerequisites
  
  # Run validation
  run_validation
  
  # Build and push images
  build_and_push_images
  
  # Update image tags in Kubernetes manifests
  update_image_tags
  
  # Apply blue environment changes first
  log "Syncing ArgoCD applications..."
  for service in "${SERVICES[@]}"; do
    argocd app sync "hms-${service}"
  done
  
  # Wait for blue environment to be ready
  log "Waiting for blue environment to be ready..."
  for service in "${SERVICES[@]}"; do
    kubectl --kubeconfig="$KUBECONFIG_PATH" -n "$NAMESPACE" argo rollouts status "$service" --watch
  done
  
  # Check health of blue environment
  check_services_health
  
  # Run smoke tests
  run_smoke_tests
  
  # Switch traffic to blue environment
  log "Switching traffic to new environment..."
  for service in "${SERVICES[@]}"; do
    switch_traffic "$service"
  done
  
  # Update documentation
  update_documentation
  
  # Notify stakeholders
  notify_stakeholders
  
  log "Deployment ${DEPLOYMENT_ID} completed successfully."
}

# Execute main function
main