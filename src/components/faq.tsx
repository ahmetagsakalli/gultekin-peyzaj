"use client";
import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";

import { useState } from "react";

export const questions = [
  {
    question: "Hangi bölgelerde hizmet veriyorsunuz?",
    answer:
      "Atakum merkezliyiz. Samsun ve çevresindeki peyzaj, bakım ve budama işleri için bizimle iletişime geçebilirsiniz.",
  },
  {
    question: "Bahçe bakımı neleri kapsıyor?",
    answer:
      "Periyodik bahçe bakımı kapsamında çim biçme, sulama ve genel bakım işleriyle ilgileniyoruz. Bahçenizin ihtiyacını birlikte değerlendirebiliriz.",
  },
  {
    question: "Bahçem için nasıl bilgi alabilirim?",
    answer:
      "Bizi arayabilir ya da WhatsApp’tan yazabilirsiniz. Bahçenizin fotoğraflarını, bulunduğu bölgeyi ve yapılmasını istediğiniz işleri paylaşmanız yeterli.",
  },
  {
    question: "Mevcut bahçemi yeniden düzenleyebilir miyiz?",
    answer:
      "Peyzaj tasarım ve uygulama hizmetimiz için mevcut bahçenizin durumunu ve istediğiniz değişiklikleri Eren Gültekin’le görüşebilirsiniz.",
  },
];

export function Faq() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="faq">
      <div className="faq-questions">
        {questions.map((item, index) => (
          <div className="faq-item" key={item.question}>
            <button
              id={`faq-question-${index}`}
              type="button"
              className={
                active === index ? "faq-question is-active" : "faq-question"
              }
              aria-expanded={active === index}
              aria-controls={`faq-answer-${index}`}
              onClick={() =>
                setActive((current) => (current === index ? null : index))
              }
            >
              <CmsText>{item.question}</CmsText>
              <span aria-hidden="true" />
            </button>
            <div
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              hidden={active !== index}
              className="faq-answer"
            >
              <p><CmsText>{item.answer}</CmsText></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
