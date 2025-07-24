import "next/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib/auth";
