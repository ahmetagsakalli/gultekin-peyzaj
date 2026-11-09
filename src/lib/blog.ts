import type { ServiceId } from "./content";

export type BlogPost = {
  slug: string;
  serviceId?: ServiceId;
  body?: string;
  readTime?: number;
  cover?: import("./cms-shared").MediaOverride;
  datePublished?: string;
  dateModified?: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  intro: string;
  sections: { title: string; paragraphs: string[] }[];
  sources: { title: string; url: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "bahce-duzenlemesine-nereden-baslamali",
    serviceId: "peyzaj",
    title: "Bahçe düzenlemesine nereden başlamalı?",
    description:
      "Bahçeyi düzenlemeden önce kullanım alanlarını, geçişleri ve bakım ihtiyacını planlamak için bir başlangıç rehberi.",
    image: "/images/trees.webp",
    alt: "Ağaçlar ve düzenli çalı gruplarıyla çevrili bahçe",
    intro:
      "Yeni bir bahçe düşünürken ilk karar çoğu zaman bitki seçimi oluyor. Oysa önce alanı nasıl kullanacağınızı belirlemek, sonradan yapılacak değişiklikleri azaltır. Oturmak, yürümek, çocuklarla vakit geçirmek ya da yalnızca yeşile bakmak: bahçenin düzeni günlük hayatınıza göre şekillenmeli.",
    sections: [
      {
        title: "Önce bahçeyi gözlemleyin",
        paragraphs: [
          "Bir gün içinde aynı noktaya birkaç kez bakın. Sabah güneş alan bir köşe öğleden sonra gölgede kalabilir. Yağmurdan sonra suyun nerede biriktiğini, hangi geçişlerin çamur olduğunu ve rüzgârın en çok hangi bölüme geldiğini not edin. Çiziminiz kusursuz olmak zorunda değil; kapıları, mevcut ağaçları ve kullanmak istediğiniz alanları işaretlemek yeterli.",
          "Bahçenin farklı köşelerinden çekilmiş fotoğraflar da işe yarar. Sadece güzel bulduğunuz yerleri değil, çözmek istediğiniz noktaları da kaydedin. Böylece görüşme sırasında neyin korunacağı ve neyin değişeceği daha kolay anlaşılır.",
        ],
      },
      {
        title: "Geçişleri ve kullanım alanlarını belirleyin",
        paragraphs: [
          "Evden bahçeye çıktığınızda izlediğiniz yol, oturma alanının konumu ve bakım ekipmanıyla geçilecek yerler birlikte düşünülmeli. Bir bitki grubunun içinden sürekli yürümek zorunda kalıyorsanız, sorun bitkilerde değil yerleşimde olabilir. Önce yürüyüş ve kullanım alanlarını yerleştirin, bitkilendirmeyi bu düzenin çevresinde ele alın.",
        ],
      },
      {
        title: "Bakımı da planın içine alın",
        paragraphs: [
          "Ayırabileceğiniz bakım zamanını baştan söyleyin. Geniş çim alan, çok sayıda saksı veya sık şekil verilmesi gereken bitkiler farklı bakım düzenleri ister. Bitki seçiminde ışık kadar toprağın yapısını da dikkate alın. Aynı bahçenin her noktasında aynı koşulların bulunduğunu varsaymayın.",
          "İlk görüşme için bahçenin yaklaşık ölçüsü, fotoğrafları ve kısa bir ihtiyaç listesi iyi bir başlangıçtır. Önceliklerinizi sıralayın: önce geçiş yolu mu, mevcut çimin bakımı mı, yoksa bütün alanın yeniden düzenlenmesi mi?",
        ],
      },
    ],
    sources: [
      {
        title: "RHS — Toprak yapısını tanıma",
        url: "https://www.rhs.org.uk/soil-composts-mulches/soil-types",
      },
    ],
  },
  {
    slug: "cim-bicerken-nelere-dikkat-edilmeli",
    serviceId: "bakim",
    title: "Çim biçerken nelere dikkat edilmeli?",
    description:
      "Çim biçme yüksekliği, zemin koşulları ve bakım sıklığı hakkında temel bilgiler.",
    image: "/images/mowing.webp",
    alt: "Çim biçme makinesi ve kenar biçme aletiyle bahçe bakımı",
    intro:
      "Çimi çok kısa kesmek, bir sonraki biçimi ertelemenin iyi bir yolu değildir. Düzenli bir görünüm için kesim yüksekliği, çimin ne kadar uzadığı ve zeminin durumu birlikte değerlendirilmelidir. Her bahçede aynı makine ayarıyla ilerlemek doğru sonuç vermeyebilir.",
    sections: [
      {
        title: "Bir seferde fazla kısaltmayın",
        paragraphs: [
          "Genel yaklaşım, tek biçimde yaprak uzunluğunun üçte birinden fazlasını almamaktır. Çim uzun süre biçilmediyse istenen yüksekliğe birkaç aşamada inmek daha uygundur. Kesim yüksekliği çim türüne, mevsime ve kullanım biçimine bağlıdır; bütün bahçeler için geçerli tek bir santimetre değeri yoktur.",
        ],
      },
      {
        title: "Islak zeminde acele etmeyin",
        paragraphs: [
          "Çok ıslak, donmuş veya ayak altında kolayca iz bırakan bir zeminde biçimi erteleyin. Yumuşak toprakta makineyle dolaşmak sıkışmaya, kesim sırasında da çim yüzeyinin zarar görmesine yol açabilir. Bıçakların temiz ve keskin olması düzgün kesim için önemlidir; kör bıçaklar yaprak uçlarını parçalayabilir.",
        ],
      },
      {
        title: "Takvimi büyümeye göre ayarlayın",
        paragraphs: [
          "Biçim sıklığını yalnızca haftanın belirli bir gününe bağlamayın. Çimin büyüme hızı, yağış ve sıcaklık değiştikçe bakım aralığı da değişir. Kurak dönemde büyüme yavaşladığında daha seyrek ve daha yüksek kesim gerekebilir.",
          "Bahçenizi takip etmek için biçim tarihlerini ve kullandığınız yüksekliği küçük bir notta tutabilirsiniz. Özellikle aynı yerde tekrar eden sararma veya seyrelme varsa fotoğraf çekin. Bu kayıt, bakım konuşulurken yalnızca son görüntüye değil değişimin seyrine de bakmayı sağlar. Kullanacağınız makinenin ayarlarını kendi kullanım kılavuzundan kontrol edin.",
        ],
      },
    ],
    sources: [
      {
        title: "RHS — Çim biçme rehberi",
        url: "https://www.rhs.org.uk/lawns/mowing",
      },
    ],
  },
  {
    slug: "bahce-sulamasinda-dogru-aliskanliklar",
    serviceId: "bakim",
    title: "Bahçe sulamasında doğru alışkanlıklar",
    description:
      "Sulama ihtiyacını toprağa, bitkiye ve hava koşullarına göre değerlendirmek için pratik notlar.",
    image: "/images/watering.webp",
    alt: "Bahçedeki bitkilerin hortumla sulanması",
    intro:
      "Sulamada en sık karşılaşılan yanılgılardan biri, her bitkinin her gün aynı miktarda su istediğini düşünmektir. Saksıda yetişen bir bitkiyle yıllardır toprakta bulunan bir ağacın ihtiyacı aynı değildir. Yeni dikilmiş bitkiler de ayrı takip gerektirir.",
    sections: [
      {
        title: "Yüzeyden fazlasına bakın",
        paragraphs: [
          "Toprağın üstü kuru görünse de biraz altında nem bulunabilir. Sulamadan önce kök çevresindeki nemi kontrol edin. Saksılarda yüzeyin birkaç santimetre altına bakmak daha anlamlıdır. Yaprakların görünümü de fikir verir; ancak tek başına bir belirtiye bakarak su miktarını artırmayın.",
        ],
      },
      {
        title: "Suyu kök bölgesine ulaştırın",
        paragraphs: [
          "Suyu yavaş vererek toprağa işlemesine fırsat tanıyın. Yalnızca yüzeyi ıslatıp geçmek yerine köklerin bulunduğu katmanın nemlenip nemlenmediğini değerlendirin. Yeni çim, yeni dikilen fidan ve yerleşmiş bitkiler için aynı süreyi kullanmayın. İhtiyaç; toprağın yapısı, bitkinin büyüklüğü ve hava koşullarıyla değişir.",
        ],
      },
      {
        title: "Yağmurdan sonra da kontrol edin",
        paragraphs: [
          "Yağmur yağmış olması her köşenin eşit ıslandığı anlamına gelmez. Saçak altında, duvar dibinde veya yoğun ağaç örtüsü altında kalan bitkilerin toprağı daha kuru olabilir. Otomatik bir sistem kullanıyorsanız programı mevsim boyunca hiç değiştirmeden bırakmayın.",
          "Sulama takibi için bahçeyi birkaç bölüme ayırabilirsiniz: saksılar, yeni dikimler, çim alan ve yerleşmiş bitkiler. Hangi bölümün ne zaman sulandığını not etmek, gereksiz tekrarları fark etmeyi kolaylaştırır. Bir bölgede sürekli su birikiyorsa yalnızca süreyi azaltmakla yetinmeyin; suyun o noktada neden toplandığını da inceleyin.",
        ],
      },
    ],
    sources: [
      {
        title: "RHS — Bitkilerde sulama",
        url: "https://www.rhs.org.uk/garden-jobs/watering",
      },
    ],
  },
  {
    slug: "budama-zamani-her-bitkide-ayni-degil",
    serviceId: "budama",
    title: "Budama zamanı her bitkide aynı değil",
    description:
      "Budama öncesinde bitkinin türünü ve çiçeklenme dönemini bilmenin neden önemli olduğu üzerine.",
    image: "/images/pruning-action.webp",
    alt: "Budama makasıyla bitkinin dalının kesilmesi",
    intro:
      "Bahçedeki bütün ağaç ve çalıları aynı gün, aynı biçimde budamak pratik görünebilir. Ancak doğru zaman bitkinin türüne ve hangi dallarda çiçek açtığına göre değişir. Budamaya başlamadan önce yapılacak işin amacını belirlemek gerekir: kuru dalları almak, biçim vermek veya fazla büyümeyi azaltmak farklı işlerdir.",
    sections: [
      {
        title: "Bitkinin adını ve çiçeklenmesini öğrenin",
        paragraphs: [
          "İlkbaharda çiçek açan pek çok çalı, tomurcuklarını önceki dönemin dallarında taşır. Çiçeklenmeden önce yapılan yoğun budama bu tomurcukları da götürebilir. Yazın çiçek açan bazı türlerde ise yeni sürgünler önemlidir. Bu nedenle yalnızca mevsime bakarak karar vermek yerine türün bakım bilgisi kontrol edilmelidir.",
        ],
      },
      {
        title: "Yeni dikilen bitkiye farklı yaklaşın",
        paragraphs: [
          "Yeni dikilmiş ağaç ve çalılarda ilk yıllarda çoğunlukla hafif düzeltme yeterlidir. Uzun süredir bakılmamış büyük bir bitkide yapılacak iş bununla aynı değildir. Yaşlanmış veya fazla sıklaşmış çalıların yenilenmesi bazen birkaç yıla yayılan bir plan gerektirir; hepsini bir kerede sert biçimde kısaltmak her tür için uygun olmaz.",
        ],
      },
      {
        title: "Kesmeden önce neyi değiştireceğinizi belirleyin",
        paragraphs: [
          "Bahçenin genel bir fotoğrafını ve budanacak bitkinin yakın planını çekin. Yola taşan dalı, kapanan görüşü veya korumak istediğiniz çiçeklenmeyi fotoğraf üzerinde göstermek işi netleştirir. Bitkinin adını bilmiyorsanız gelişigüzel bir takvim uygulamak yerine önce tanımlanmasını isteyin.",
          "Görüşmeye hazırlık için bitkinin yaklaşık yüksekliğini, en son ne zaman budandığını ve bu yıl çiçek açıp açmadığını not edin. Yüksek ağaçlar ya da büyük dallar söz konusuysa kullanılacak ekipman ve erişim koşulları ayrıca değerlendirilmelidir.",
        ],
      },
    ],
    sources: [
      {
        title: "RHS — Çalılarda budama",
        url: "https://www.rhs.org.uk/advice/beginners-guide/pruning-plants/pruning-shrubs",
      },
    ],
  },
  {
    slug: "sonbaharda-cim-bakimi",
    serviceId: "bakim",
    title: "Sonbaharda çim alanı gözden geçirmek",
    description:
      "Yazın ardından çim alandaki seyrelme, birikinti ve sıkışmayı değerlendirmek için bakım notları.",
    image: "/images/autumn.webp",
    alt: "Çim alanın üzerinde biriken sonbahar yaprakları",
    intro:
      "Yaz boyunca kullanılan bir çim alanın her köşesi aynı şekilde yıpranmaz. Oturma grubunun yanı, sık yürünülen geçişler veya uzun süre susuz kalan bölümler farklı görünebilir. Sonbahar bakımı, bütün işlemleri sırasıyla uygulamak yerine önce bu farkları görerek başlamalıdır.",
    sections: [
      {
        title: "Alanı bölümler halinde inceleyin",
        paragraphs: [
          "Bahçede yavaşça dolaşıp seyrekleşen ve sık kullanılan noktaları işaretleyin. Çim yaprakları arasında toprağı görmeyi engelleyen kalın bir kuru artık tabakası olup olmadığına bakın. İhtiyaca göre yapılacak yüzey temizliği, suyun toprağa ulaşmasını ve bitkiler arasındaki hava hareketini destekleyebilir. Her çim alanın her yıl aynı yoğunlukta işlem görmesi gerekmez.",
        ],
      },
      {
        title: "Sıkışan bölgeleri ayırt edin",
        paragraphs: [
          "Sık kullanılan yerlerde toprak sıkışması görülebilir. Uygun havalandırma işlemleri kök çevresinde hava ve su hareketine yardımcı olur; ancak işlem türü alanın durumuna göre seçilmelidir. Çimdeki her boşluk aynı nedenden oluşmaz. Onarıma geçmeden önce gölge, kullanım yoğunluğu ve suyun dağılımını birlikte değerlendirin.",
        ],
      },
      {
        title: "Bakım gününü hava koşullarına göre seçin",
        paragraphs: [
          "Ilıman ve nemli koşullar çimin toparlanması için elverişli olabilir. Bununla birlikte takvimde sonbahar yazması tek başına yeterli değildir. Çok ıslak veya donmuş zeminde çalışmayı ertelemek gerekir. Bölgenin o günkü koşullarını ve kullanılan çim türünü dikkate alın.",
          "Bakım öncesinde ve sonrasında aynı açıdan fotoğraf çekmek değişimi izlemeyi kolaylaştırır. Yapılan işi, kullanılan malzemeyi ve tarihi bir yere kaydedin. Sonraki bakımda bu kayda bakarak gerçekten ihtiyaç duyulan işlemlere karar verebilir, her defasında baştan aynı uygulamaları tekrarlamamış olursunuz.",
        ],
      },
    ],
    sources: [
      {
        title: "RHS — Sonbaharda çim bakımı",
        url: "https://www.rhs.org.uk/lawns/autumn-care",
      },
      {
        title: "RHS — Çim biçme ve zemin koşulları",
        url: "https://www.rhs.org.uk/lawns/mowing",
      },
    ],
  },
  {
    slug: "bitki-secmeden-once-topragi-taniyin",
    serviceId: "peyzaj",
    title: "Bitki seçmeden önce toprağı tanıyın",
    description:
      "Killi ve kumlu toprağın farkları, bahçeyi gözlemleme ve bitki seçimi üzerine temel bilgiler.",
    image: "/images/soil.webp",
    alt: "Bahçe toprağına elle fide dikilmesi",
    intro:
      "Bir bitkinin fotoğrafını beğenmek, bahçenizde aynı şekilde gelişeceği anlamına gelmez. Işık ve yerleşim kadar köklerin bulunduğu toprak da önemlidir. Bitki almadan önce zemini tanımak, bakım planını daha gerçekçi kurmanıza yardımcı olur.",
    sections: [
      {
        title: "Su toprakta nasıl davranıyor?",
        paragraphs: [
          "Killi topraklar suyu daha uzun tutabilir ve ıslakken kolay sıkışabilir. Kumlu topraklar ise genellikle daha hızlı süzülür ve daha çabuk kurur. Bir avuç nemli toprağın dokusu başlangıç için fikir verir: belirgin taneler kumlu yapıya, ele yapışan ve şekil alan doku killi yapıya işaret edebilir. Bu gözlem ayrıntılı bir analiz yerine geçmez.",
        ],
      },
      {
        title: "Bahçenin her köşesi aynı olmayabilir",
        paragraphs: [
          "İnşaat, dolgu veya geçmişte yapılan düzenlemeler farklı toprakları bir araya getirmiş olabilir. Bu yüzden tek bir noktaya bakarak bütün bahçe hakkında karar vermeyin. Yeni bitki yerleştirmek istediğiniz alanları ayrı ayrı gözlemleyin ve suyun uzun süre kaldığı yerleri not edin.",
          "Bir alışveriş listesi hazırlamadan önce bitkileri koymayı düşündüğünüz köşeleri fotoğraflayın. Fotoğrafın yanında güneş aldığı saatleri, zeminin yağmurdan sonraki durumunu ve yakınındaki mevcut bitkileri yazın. Bu kayıtlar, yalnızca saksıdaki görünüşüne göre karar vermenizi önler.",
        ],
      },
      {
        title: "Önce ihtiyacı belirleyin",
        paragraphs: [
          "Toprağın yapısı ile besin durumu aynı şey değildir. Görünüşüne bakarak rastgele malzeme veya gübre eklemek yerine neyi iyileştirmek istediğinizi belirleyin. Bitkinin tercih ettiği koşulları öğrenin; gerekiyorsa toprak analiziyle değerlendirmeyi destekleyin.",
          "Bahçe düzenlemesi görüşmesinde yalnızca istediğiniz çiçekleri değil, toprağa dair gözlemlerinizi de paylaşın. Böylece bitkilendirme, sulama ve sonraki bakım tek tek alınmış kararlar olmaktan çıkar; aynı alanın koşullarına göre birlikte ele alınır.",
        ],
      },
    ],
    sources: [
      {
        title: "RHS — Toprak türleri ve özellikleri",
        url: "https://www.rhs.org.uk/soil-composts-mulches/soil-types",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
