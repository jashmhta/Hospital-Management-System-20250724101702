import "@/lib/security/encryption.service";
import "@/lib/session";
import "next/server";
import { encryptSensitiveData } from "@/lib/security/encryption.service";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
