
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BackupDirectorRequest {
  organizationId: string | number;
  directorEmail: string;
  directorName: string;
  backupDirectorEmail: string;
  backupDirectorName: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Create a service role client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { 
      organizationId, 
      directorEmail, 
      directorName,
      backupDirectorEmail, 
      backupDirectorName 
    } = await req.json() as BackupDirectorRequest;

    // Check that the organization exists
    const { data: orgData, error: orgError } = await supabaseClient
      .from("organizations")
      .select("id, name")
      .eq("id", organizationId)
      .single();

    if (orgError || !orgData) {
      return new Response(
        JSON.stringify({ 
          error: "Organization not found", 
          details: orgError 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check if the backup director already exists
    const { data: existingUsers, error: userError } = await supabaseClient
      .from("users")
      .select("id, email")
      .eq("email", backupDirectorEmail);

    if (userError) {
      return new Response(
        JSON.stringify({ 
          error: "Error checking users", 
          details: userError 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Update the organization with pending backup director
    // We'll store the email for now, and update it to the ID once they register
    const { error: updateError } = await supabaseAdmin
      .from("organizations")
      .update({ 
        backup_director_id: existingUsers?.[0]?.id || null,
        // Store pending backup director info in metadata if they don't exist yet
        metadata: {
          pending_backup_director_email: existingUsers?.[0]?.id ? null : backupDirectorEmail,
          pending_backup_director_name: existingUsers?.[0]?.id ? null : backupDirectorName
        }
      })
      .eq("id", organizationId);

    if (updateError) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to update organization", 
          details: updateError 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // In a real-world app, this is where we would send an email to the backup director
    console.log(`
      Invitation would be sent to:
      Email: ${backupDirectorEmail}
      Name: ${backupDirectorName}
      Organization: ${orgData.name}
      From: ${directorName} (${directorEmail})
    `);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Backup director invitation process initiated"
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Server error",
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
