import { Landmark } from "lucide-react";
import { cn } from "../../utils/cn";
import { serviceConnectors, type ConnectorState } from "../../data/intelligenceData";

const stateStyles: Record<ConnectorState, string> = {
  "Live / Authorized": "bg-[#eaf3ea] text-[#2f6b3a] border-[#c9e2cb]",
  Sandbox: "bg-[#eef2fb] text-[#3a5a9c] border-[#cdd9f0]",
  Simulated: "bg-[#fbf1e0] text-[#9c6b1a] border-[#f0dcb2]",
  Future: "bg-[#f1ece2] text-[#7a6a55] border-[#e0d6c5]",
};

/**
 * Verification connectors with truthful states. This prototype holds no
 * authorisation for live government systems and never claims otherwise.
 */
export function ServicesHub() {
  return (
    <div className="rounded-[20px] border border-[#e5ded1] bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
            <Landmark size={17} className="text-[#8a5a35]" /> Government Services & Verification
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#6b5c4a]">
            Connector status for document verification sources. Every connector states its real mode — no live
            government access is claimed in this prototype.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {serviceConnectors.map((connector) => (
          <div key={connector.name} className="rounded-lg border border-[#e5ded1] bg-[#faf8f4] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-[#3d2b1f]">{connector.name}</p>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                  stateStyles[connector.state]
                )}
              >
                {connector.state}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#8a7c68]">{connector.purpose}</p>
            <p className="mt-2 text-xs text-[#a4977f]">{connector.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
