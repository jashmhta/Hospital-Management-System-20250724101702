import "next/headers";
import "zod";
import { IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { Consultation } from "@/lib/database";
import { cookies } from "@/lib/database";
import { getCloudflareContext } from "@/lib/database";
