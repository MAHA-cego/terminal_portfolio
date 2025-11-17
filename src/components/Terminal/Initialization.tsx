import React from "react";
import Typewriter from "@/components/Terminal/Typewriter";

export default function Initialization() {
  const bootText = `
Loading portfolio data... OK
Initializing display... OK
Preparing input... OK

C.G. Workstation v1.0
© 2025

System initialization complete.
Type 'help' for available commands.
`;
  return (
    <div className="mb-4">
      <Typewriter text={bootText} speed={0.015} />
    </div>
  );
}