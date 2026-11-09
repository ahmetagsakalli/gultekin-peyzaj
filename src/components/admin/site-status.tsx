import { ArrowUpRight, Check, MessageCircle, Plus } from "lucide-react";

import { panelServices as services, serviceFooter } from "@/lib/panel-config";

export function SiteStatus() {
  return <div className="ka-page ka-site-status">
    <div className="ka-page-heading">
      <div><h1>Site durumu</h1><p>Mevcut özellikleriniz ve sitenize ekleyebileceğimiz hizmetler.</p></div>
      <a className="ka-secondary" href="/" target="_blank" rel="noopener noreferrer">Siteyi aç<ArrowUpRight size={17} aria-hidden="true" /></a>
    </div>

    <section className="ka-service-list" aria-labelledby="services-title">
      <div className="ka-service-list-heading">
        <h2 id="services-title">Özellikler ve ek hizmetler</h2>
        <p><span className="ka-owned-text"><Check size={15} aria-hidden="true" />Sitenizde var</span><span className="ka-available-text"><Plus size={15} aria-hidden="true" />Eklenebilir</span></p>
      </div>
      <ul>{services.map(service => <li key={service.id} className={`ka-service-row ${service.included ? "ka-service-owned" : "ka-service-available"}`}>
        <span className="ka-service-mark" aria-hidden="true">{service.included ? <Check size={21} strokeWidth={2} /> : <Plus size={21} strokeWidth={1.8} />}</span>
        <div className="ka-service-copy"><h3>{service.title}{!service.included && <span className="ka-sr-only"> — Eklenebilir</span>}</h3><p>{service.description}</p></div>
        {service.included ? <span className="ka-service-state">Sitenizde var</span> : <div className="ka-service-state ka-service-price"><strong>{service.price.label}</strong><span>{service.price.detail}</span></div>}
        <div className="ka-service-action">{service.included ? <Check className="ka-service-done" size={18} aria-hidden="true" /> : <a href={service.href} target="_blank" rel="noopener noreferrer" aria-label={`${service.title}: ${service.action} (${service.destination}, yeni sekme)`}>{service.action}<ArrowUpRight size={16} aria-hidden="true" /></a>}</div>
      </li>)}</ul>
    </section>
    <div className="ka-service-bottom"><p>{serviceFooter.note}</p><a href={serviceFooter.contactHref} target="_blank" rel="noopener noreferrer" aria-label="Koçyiğit Yazılım ile WhatsApp üzerinden görüşün (yeni sekme)"><MessageCircle size={17} aria-hidden="true" />Koçyiğit Yazılım<ArrowUpRight size={15} aria-hidden="true" /></a></div>
  </div>;
}
