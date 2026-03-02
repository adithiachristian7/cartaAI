import React from "react";
import Hero from "../components/Hero";
import RecentInvitations from "../components/RecentInvitations";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Chatbot from "../components/Chatbot";

function Home() {
  return (
    <>
      <Hero />
      <RecentInvitations />
      <Features />
      <Pricing />
      <Testimonials />
    </>
  );
}

export default Home;
