import type { LegalDocOpts, LegalSection } from "./legalSectionTypes";

export function termsSectionsTail(opts: LegalDocOpts): LegalSection[] {
  const { supportEmail, phone, website, deleteAccountUrl } = opts;
  return [
    {
      title: "8. Бүртгэл устгах",
      paragraphs: [
        `Хэрэглэгч өөрийн бүртгэлээ устгах хүсэлт гаргах эрхтэй. Бүртгэл устгах зааврыг app дотор болон дараах хуудаснаас үзнэ:`,
        `Account Deletion URL: ${deleteAccountUrl}`,
        `Бүртгэл устгах үед хэрэглэгчийн profile, progress, saved data зэрэг мэдээлэл устгагдаж болно. Хууль, санхүү, fraud prevention, security зорилгоор хадгалах шаардлагатай мэдээллийг тодорхой хугацаанд хадгалж болно.`,
      ],
    },
    {
      title: "9. Үйлчилгээний өөрчлөлт",
      paragraphs: [
        `Бид аппын боломж, агуулга, үнэ, interface, сургалтын бүтэц болон үйлчилгээний нөхцөлийг шинэчлэх эрхтэй. Томоохон өөрчлөлт гарвал app дотор эсвэл website дээр мэдээлнэ.`,
      ],
    },
    {
      title: "10. Хариуцлагын хязгаарлалт",
      paragraphs: [
        `Апп ашигласнаас үүдэн гарах шууд бус, санамсаргүй, үр дагаврын хохиролд бид хуульд зөвшөөрөгдөх хэмжээнд хариуцлага хүлээхгүй.`,
        `Апп нь интернет, төхөөрөмж, OS version, third-party service, Google Play, App Store зэрэг гаднын нөхцлөөс шалтгаалан түр доголдож болно.`,
      ],
    },
    {
      title: "11. Холбоо барих",
      paragraphs: [
        `Үйлчилгээний нөхцөлтэй холбоотой асуулт байвал бидэнтэй холбогдоно уу.`,
        `Email: ${supportEmail}`,
        `Утас: ${phone}`,
        `Website: ${website}`,
      ],
    },
  ];
}
