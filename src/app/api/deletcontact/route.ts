import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Contact from "@/models/contactModels";

connect();

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Contact ID required", status: 400 });
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json({ message: "Contact not found", status: 404 });
    }

    console.log("Deleted Contact: ", deletedContact);
    return NextResponse.json({
      message: "Contact deleted successfully",
      status: 200,
      deletedContact,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
