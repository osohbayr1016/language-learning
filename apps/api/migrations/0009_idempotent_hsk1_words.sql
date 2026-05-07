-- Remote/production D1 that never ran 0002: ensures ids 1–25 for lesson_words FK.
-- INSERT OR IGNORE: no-op if rows already exist (e.g. 0002 applied).

INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES
(1,'你好','nǐ hǎo','ni3 hao3','[3,3]','Сайн уу','Hello',1,'phrase','你好，我叫李明。','nǐ hǎo, wǒ jiào Lǐ Míng.','Сайн уу, намайг Ли Мин гэдэг.',5),
(2,'谢谢','xiè xiè','xie4 xie4','[4,4]','Баярлалаа','Thank you',1,'phrase','谢谢你的帮助。','xiè xiè nǐ de bāngzhù.','Тусалсанд баярлалаа.',10),
(3,'再见','zài jiàn','zai4 jian4','[4,4]','Баяртай','Goodbye',1,'phrase','明天见，再见！','míngtiān jiàn, zài jiàn!','Маргааш уулзъя, баяртай!',9),
(4,'我','wǒ','wo3','[3]','Би','I/Me',1,'pronoun','我是学生。','wǒ shì xuésheng.','Би оюутан.',3),
(5,'你','nǐ','ni3','[3]','Чи','You',1,'pronoun','你叫什么名字？','nǐ jiào shénme míngzi?','Чиний нэр юу вэ?',7),
(6,'他','tā','ta1','[1]','Тэр (эр)','He',1,'pronoun','他是我的朋友。','tā shì wǒ de péngyǒu.','Тэр миний найз.',5),
(7,'她','tā','ta1','[1]','Тэр (эм)','She',1,'pronoun','她很漂亮。','tā hěn piàoliang.','Тэр маш үзэсгэлэнтэй.',6),
(8,'是','shì','shi4','[4]','Байна (тэмдэг)','To be',1,'verb','我是中国人。','wǒ shì zhōngguórén.','Би хятад хүн.',9),
(9,'不','bù','bu4','[4]','Үгүй','No/Not',1,'adverb','我不饿。','wǒ bù è.','Би өлссөнгүй.',4),
(10,'好','hǎo','hao3','[3]','Сайн','Good',1,'adjective','今天天气很好。','jīntiān tiānqì hěn hǎo.','Өнөөдөр цаг агаар маш сайн.',6),
(11,'大','dà','da4','[4]','Том','Big',1,'adjective','这个苹果很大。','zhège píngguǒ hěn dà.','Энэ алим маш том.',3),
(12,'小','xiǎo','xiao3','[3]','Жижиг','Small',1,'adjective','我有一只小猫。','wǒ yǒu yī zhī xiǎo māo.','Надад нэг жижиг муур байна.',3),
(13,'人','rén','ren2','[2]','Хүн','Person',1,'noun','这里有很多人。','zhèlǐ yǒu hěn duō rén.','Энд маш олон хүн байна.',2),
(14,'中国','Zhōngguó','Zhong1guo2','[1,2]','Хятад','China',1,'noun','我来自中国。','wǒ láizì Zhōngguó.','Би Хятадаас ирсэн.',8),
(15,'学生','xuésheng','xue2sheng5','[2,0]','Оюутан','Student',1,'noun','我是大学生。','wǒ shì dàxuéshēng.','Би их сургуулийн оюутан.',13),
(16,'老师','lǎoshī','lao3shi1','[3,1]','Багш','Teacher',1,'noun','我的老师很好。','wǒ de lǎoshī hěn hǎo.','Миний багш маш сайн.',11),
(17,'一','yī','yi1','[1]','Нэг','One',1,'number','我有一个苹果。','wǒ yǒu yīgè píngguǒ.','Надад нэг алим байна.',1),
(18,'二','èr','er4','[4]','Хоёр','Two',1,'number','我有两个妹妹。','wǒ yǒu liǎng gè mèimei.','Надад хоёр дүү (эгч) байна.',2),
(19,'三','sān','san1','[1]','Гурав','Three',1,'number','请等三分钟。','qǐng děng sān fēnzhōng.','Гурван минут хүлээнэ үү.',3),
(20,'吃','chī','chi1','[1]','Идэх','Eat',1,'verb','我想吃饺子。','wǒ xiǎng chī jiǎozi.','Би бооз идмээр байна.',6),
(21,'喝','hē','he1','[1]','Уух','Drink',1,'verb','我喜欢喝茶。','wǒ xǐhuān hē chá.','Би цай уухыг дуртай.',12),
(22,'来','lái','lai2','[2]','Ирэх','Come',1,'verb','请进来！','qǐng jìnlái!','Орж ирнэ үү!',7),
(23,'去','qù','qu4','[4]','Явах','Go',1,'verb','我去学校。','wǒ qù xuéxiào.','Би сургуульд явна.',5),
(24,'看','kàn','kan4','[4]','Харах/Үзэх','Look/Watch',1,'verb','我喜欢看电影。','wǒ xǐhuān kàn diànyǐng.','Би кино үзэхийг дуртай.',9),
(25,'说','shuō','shuo1','[1]','Хэлэх','Say/Speak',1,'verb','他说中文。','tā shuō zhōngwén.','Тэр хятадаар ярьдаг.',14);
