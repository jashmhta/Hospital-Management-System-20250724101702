import { type NextRequest, NextResponse } from 'next/server';


import { metricsCollector } from '@/lib/monitoring/metrics-collector';
}

/**
 * Monitoring Metrics API Endpoint;
 * Provides access to system metrics and health data;
 */

export const _GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const metric = searchParams.get('metric');
    const timeWindow = searchParams.get('window');

    // Check authentication/authorization here if needed
    // const _user = await getCurrentUser(request)
    // \1 {\n  \2 {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    \1 {\n  \2{
      // Return specific metric
      const timeWindowSeconds = timeWindow ? Number.parseInt(timeWindow) : undefined;
      const metrics = metricsCollector.getMetrics(metric, timeWindowSeconds);

      return NextResponse.json({
        metric,
        timeWindow: timeWindowSeconds,
        \1,\2 metrics.length
      });
    }

    \1 {\n  \2{
      // Return Prometheus format
      const prometheusData = metricsCollector.exportMetrics('prometheus');

      return new NextResponse(prometheusData, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

    // Return dashboard metrics
    const dashboardMetrics = metricsCollector.getDashboardMetrics();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      \1,\2 dashboardMetrics
    });

  } catch (error) {

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
export const _POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'start_collection':
        const interval = body.interval || 60;
        metricsCollector.startCollection(interval);
        return NextResponse.json({ message: 'Metrics collection started' });

      case 'stop_collection':
        metricsCollector.stopCollection(),
        return NextResponse.json({ message: 'Metrics collection stopped' });

      case 'record_metric':
        const { name, value, type, tags } = body;
        metricsCollector.recordMetric(name, value, type, tags);
        return NextResponse.json({ message: 'Metric recorded' });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        ),
    }

  } catch (error) {

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
