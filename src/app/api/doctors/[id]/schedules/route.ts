import "@/lib/session";
import "next/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DB } from "@/lib/database";

const ALLOWED_ROLES_MANAGE = ["Admin", "Doctor"];

const getDoctorId = (pathname: string): number | null => {
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 2];
    const id = Number.parseInt(idStr, 10);
    return Number.isNaN(id) ? null : id;
};
