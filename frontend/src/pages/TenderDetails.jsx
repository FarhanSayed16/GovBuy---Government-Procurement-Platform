// src/pages/TenderDetails.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTenderByIdQuery } from "../features/api/tender.api";
import {
  useGetMyBidsQuery,
  useSubmitBidMutation,
  useGetTenderBidsQuery,
} from "../features/api/bid.api";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import TenderCard from "../components/TenderCard";
import { Button, Input } from "../components";
import BidCard from "../components/BidCard";
import AttachmentsList from "../components/AttachementsList";

export default function TenderDetails() {
  const { id } = useParams();
  const { data: tenderRes, isLoading, isError } = useGetTenderByIdQuery(id);
  const tender = tenderRes?.data;

  console.log("Tender", tender);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [submitBid, { isLoading: bidding }] = useSubmitBidMutation();
  const { data: myBidsRes } = useGetMyBidsQuery(undefined, {
    skip: !isAuthenticated || user.role !== "supplier",
  });
  const myBid = myBidsRes?.data?.docs?.find((b) => b.tender._id === id);

  const {
    data: allBidsRes,
    error: allBidsError,
    isLoading: allBidsLoading,
  } = useGetTenderBidsQuery(id, {
    skip:
      !isAuthenticated ||
      ![
        "admin",
        "government",
        "procurement_officer",
        "department_head",
      ].includes(user.role),
  });
  const allBids = allBidsRes?.data?.docs ?? [];

  console.log("useGetTenderBidsQuery →", {
    skip:
      !isAuthenticated ||
      ![
        "admin",
        "government",
        "procurement_officer",
        "department_head",
      ].includes(user.role),
    allBidsRes,
    allBidsLoading,
    allBidsError,
  });

  console.log("allbids", allBids);
  // Bid form state
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleBid = async (e) => {
    e.preventDefault();
    if (!amount) return setError("Amount is required");
    setError("");
    const formData = new FormData();
    formData.append("tenderId", id);
    formData.append("amount", amount);
    formData.append("proposal", proposal);
    if (file) formData.append("proposalDoc", file);

    try {
      await submitBid(formData).unwrap();
    } catch (err) {
      setError(err.data?.message || "Bid failed");
    }
  };

  if (isLoading) return <p>Loading tender...</p>;
  if (isError || !tender)
    return <p className="text-red-500">Tender not found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Tender Info */}
      <section className="bg-white p-6 shadow rounded-md">
        <h1 className="text-2xl font-bold mb-2">{tender.title}</h1>
        <p className="text-gray-700 mb-4">{tender.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Category: {tender.category}</span>
          <span>City: {tender.city}</span>
          <span>Budget: ₹{tender.budget.toLocaleString()}</span>
          <span>
            Deadline: {format(new Date(tender.deadline), "dd MMM yyyy")}
          </span>
          <span>Status: {tender.status}</span>
        </div>
        {/* Attachments */}
        {tender.attachments?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-1">Attachments:</h3>
            <AttachmentsList ids={tender.attachments} />
          </div>
        )}
      </section>

      {/* Supplier Bid Section */}
      {isAuthenticated &&
        user.role === "supplier" &&
        tender.status === "open" && (
          <>
            {myBid ? (
              // ==== ALREADY BIDDEN ====
              <section className="bg-yellow-50 p-6 shadow rounded-md">
                <h2 className="text-xl font-semibold mb-2">Bid Submitted</h2>
                <p className="text-gray-700">
                  You’ve already placed a bid of{" "}
                  <span className="font-medium">
                    ₹{myBid.bidAmount.toLocaleString()}
                  </span>
                  . Current status:{" "}
                  <span
                    className={`font-medium ${
                      myBid.status === "accepted"
                        ? "text-green-600"
                        : myBid.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {myBid.status}
                  </span>
                  .
                </p>
              </section>
            ) : (
              // ==== NEW FORM ====
              <section className="bg-white p-6 shadow rounded-md">
                <h2 className="text-xl font-semibold mb-4">Submit Your Bid</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleBid} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Amount (₹)*
                    </label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Proposal</label>
                    <textarea
                      rows={3}
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Attach Document (optional)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full"
                    />
                  </div>
                  <div className="text-right">
                    <Button type="submit" disabled={bidding}>
                      {bidding ? "Submitting..." : "Submit Bid"}
                    </Button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}

      {/* Your Bid Info */}
      {myBid && (
        <section className="bg-green-50 p-4 border border-green-200 rounded-md">
          <h2 className="font-semibold">Your Bid</h2>
          <p>Amount: ₹{myBid.bidAmount.toLocaleString()}</p>
          <p>Status: {myBid.status}</p>
        </section>
      )}

      {/* Bid List for Owner/Admin */}
      {isAuthenticated &&
        [
          "admin",
          "government",
          "procurement_officer",
          "department_head",
        ].includes(user.role) && (
          <section className="bg-white p-6 shadow rounded-md">
            <h2 className="text-xl font-semibold mb-4">All Bids</h2>
            {allBids.length === 0 ? (
              <p className="text-gray-600">No bids submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {allBids.map((bid) => (
                  <BidCard key={bid._id} bid={bid} viewBid />
                ))}
              </div>
            )}
          </section>
        )}
    </div>
  );
}
