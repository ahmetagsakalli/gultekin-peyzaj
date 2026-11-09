export type ServiceId = "peyzaj" | "bakim" | "budama";

export type Service = {
  id: ServiceId;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  details: string[];
  image: string;
  alt: string;
};

export const business = {
  name: "Gültekin Peyzaj",
  owner: "Eren Gültekin",
  location: "Atakum / Samsun",
  region: "Samsun ve çevresi",
  phone: "0545 951 23 53",
  phoneHref: "tel:+905459512353",
  whatsapp: "https://wa.me/905459512353",
  instagram: "https://www.instagram.com/gultknpeyzaj/",
  instagramHandle: "@gultknpeyzaj",
  facebook: "https://www.facebook.com/share/1Feyb6XtPa/?mibextid=wwXIfr",
} as const;

const serviceMessages: Record<ServiceId, string> = {
  peyzaj: "Merhaba, bahçem için peyzaj tasarım ve uygulama hakkında bilgi almak istiyorum.",
  bakim: "Merhaba, bahçem için çim biçme, sulama ve düzenli bakım hakkında bilgi almak istiyorum.",
  budama: "Merhaba, bahçemdeki ağaç ve bitkilerin budanması hakkında bilgi almak istiyorum.",
};

export function serviceWhatsAppHref(id: ServiceId) {
  return `${business.whatsapp}?text=${encodeURIComponent(serviceMessages[id])}`;
}

export const navigation = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetlerimiz" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const gardenSteps = [
  {
    title: "Bahçenizi anlatın.",
    description:
      "Bahçenizin fotoğraflarını, bulunduğu bölgeyi ve aklınızdaki değişikliği paylaşın.",
    caption: "İlk görüşme",
    image: "/images/hero.webp",
  },
  {
    title: "İhtiyacı birlikte belirleyelim.",
    description:
      "Yeni bir düzenleme, çim bakımı ya da budama. Yapılacak işi birlikte değerlendirelim.",
    caption: "Bahçenin ihtiyaçları",
    image: "/images/garden.webp",
  },
  {
    title: "Uygulamayı planlayalım.",
    description:
      "İşin kapsamını ve zamanını konuşalım; bahçeniz için izlenecek yolu netleştirelim.",
    caption: "Uygulama planı",
    image: "/images/soil.webp",
  },
  {
    title: "Bakımı sürdürelim.",
    description:
      "Çim biçme, sulama ve budama ihtiyaçlarına göre düzenli bakım üzerine görüşelim.",
    caption: "Düzenli bakım",
    image: "/images/mowing.webp",
  },
] as const;

export const services: Service[] = [
  {
    id: "peyzaj",
    number: "01",
    title: "Peyzaj tasarım ve uygulama",
    shortTitle: "Peyzaj tasarımı",
    summary:
      "Bahçenizi kullanımınıza ve bulunduğu alana göre birlikte şekillendirelim.",
    description:
      "Yeni bir bahçe düzenlemesi ya da mevcut alanınızda bir değişiklik. Peyzaj tasarım ve uygulama ihtiyaçlarınız için bizimle iletişime geçebilirsiniz.",
    details: ["Bahçe düzenlemesi", "Peyzaj tasarımı", "Peyzaj uygulaması"],
    image: "/images/garden.webp",
    alt: "Bitkiler ve çiçekler arasında uzanan bahçe yolu",
  },
  {
    id: "bakim",
    number: "02",
    title: "Periyodik bahçe bakımı",
    shortTitle: "Bahçe bakımı",
    summary:
      "Çim biçme, sulama ve düzenli bakımla bahçenize mevsim boyunca özen gösterelim.",
    description:
      "Bahçenin bakımı düzenli ilgi ister. Çim biçme, sulama ve genel bahçe bakımı için ihtiyacınıza uygun bir bakım düzeni üzerine görüşebiliriz.",
    details: ["Çim biçme", "Sulama", "Düzenli bahçe bakımı"],
    image: "/images/mowing.webp",
    alt: "Çim biçme makinesi ve kenar biçme aletiyle yapılan bahçe bakımı",
  },
  {
    id: "budama",
    number: "03",
    title: "Ağaç ve bitki budama",
    shortTitle: "Budama",
    summary:
      "Ağaç ve bitkilerinizin budama ihtiyacını birlikte değerlendirelim.",
    description:
      "Bahçenizdeki ağaç ve bitkilerin budama işleri için bizi arayabilirsiniz. Bitkinin mevcut durumunu ve yapılacak işi görüşerek ilerleyelim.",
    details: ["Ağaç budama", "Bitki budama", "Bahçe içi düzenleme"],
    image: "/images/pruning-action.webp",
    alt: "Budama makasıyla bir bitkinin dalının kesilmesi",
  },
];
