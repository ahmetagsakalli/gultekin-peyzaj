"use client";
import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";



import { useState } from "react";
import { gardenSteps } from "@/lib/content";

export function GardenProcess() {
  const [active, setActive] = useState(0);

  return (
    <div className="garden-process">
      <div className="process-visual" aria-hidden="true">
        {gardenSteps.map((step, index) => (
          <div
            key={step.title}
            className={`process-scene${active === index ? " is-active" : ""}`}
          >
            <CmsImage
              src={step.image}
              alt=""
              fill
              sizes="(max-width: 700px) 90vw, 600px"
            />
            <div className="process-scene-shade" />
            <span className="process-scene-number">{index + 1}</span>
            <span className="process-scene-label"><CmsText>{step.caption}</CmsText></span>
          </div>
        ))}
      </div>
      <ol className="process-steps" aria-label="Bahçeniz için çalışma adımları">
        {gardenSteps.map((step, index) => (
          <li
            key={step.title}
            className={active === index ? "is-active" : undefined}
          >
            <button
              type="button"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span className="process-step-number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="process-step-copy">
                <span className="process-step-title"><CmsText>{step.title}</CmsText></span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
