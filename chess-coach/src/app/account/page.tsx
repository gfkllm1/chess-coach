"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type  Mode = "signup" | "login";
export default function Accountpage(){
        const router = useRouter();
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [mode, setMode] = useState<Mode>("login");

async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            alert(error.message);
        } else {
            router.replace("/");
        }
    } else {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) {
            alert(error.message);
        } else {
            alert("Account Created Successfully!"); 
        }
    }
}
}