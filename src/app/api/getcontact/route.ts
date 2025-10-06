import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Contact from "@/models/contactModels";

connect();

export async function GET() {
  try {
    const allContacts = await Contact.find().sort({ createdAt: -1 });

    if (!allContacts || allContacts.length === 0) {
      return NextResponse.json({
        message: "No contacts found",
        status: 404,
      });
    }

    console.log("All Contacts Fetched: ", allContacts);

    return NextResponse.json({
      message: "All contacts fetched successfully",
      status: 200,
      data: allContacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
}
