import "next-auth";
import "next/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import NotFoundError from "@/lib/errors";
import UnauthorizedError from "@/lib/errors";
import { authOptions } from "@/lib/database";
