-- Migration: 0012_hsk1_full_course.sql
-- HSK 1 Full Course: 150 words, 15 lessons
-- ROLLOUT: Destructive for chapter 1 (DELETE lessons/progress below). Run once per environment;
--       afterward use only 0017+ idempotent patches for course tweaks.

-- NEW HSK 1 VOCABULARY

INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (26,'吗','ma','ma','[]','~uu/~үү (asuuh)','(question particle)',1,'particle','你是学生吗？','Nǐ shì xuésheng ma?','Chi oyutan uu?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (27,'不客气','bú kèqi','bú kèqi','[]','Zügeer','You''re welcome',1,'phrase','不客气！','Bú kèqi!','Zügeer!',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (28,'对不起','duìbuqǐ','duìbuqǐ','[]','Uuchlaarai','Sorry',1,'phrase','对不起，我来晚了。','Duìbuqǐ, wǒ lái wǎn le.','Uuchlaarai, bi hojuu irsen.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (29,'没关系','méi guānxi','méi guānxi','[]','Zügeer dee','It doesn''t matter',1,'phrase','没关系。','Méi guānxi.','Zügeer.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (30,'请','qǐng','qǐng','[]','Guiya','Please',1,'verb','请坐。','Qǐng zuò.','Suugaarai.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (31,'同学','tóngxué','tóngxué','[]','Angiin naiz','Classmate',1,'noun','同学们好。','Tóngxué men hǎo.','Angiin naizdaa sain uu?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (32,'也','yě','yě','[]','Bas/mön','Also',1,'adverb','我也是学生。','Wǒ yě shì xuésheng.','Bi bas oyutan.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (33,'们','men','men','[]','~nar (olon too)','(plural suffix)',1,'particle','我们去学校。','Wǒmen qù xuéxiào.','Bid surguulid ochloo.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (34,'的','de','de','[]','~iin/~iin','(possessive particle)',1,'particle','这是我的书。','Zhè shì wǒ de shū.','Ene minii nom.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (35,'叫','jiào','jiào','[]','Nerledeg','To be called',1,'verb','我叫李明。','Wǒ jiào Lǐ Míng.','Namaig Li Ming gedeg.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (36,'什么','shénme','shénme','[]','Yuu','What',1,'pronoun','你叫什么名字？','Nǐ jiào shénme míngzi?','Chinii ner yuu ve?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (37,'名字','míngzi','míngzi','[]','Ner','Name',1,'noun','他的名字很好。','Tā de míngzi hěn hǎo.','Tuunii ner sain.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (38,'认识','rènshi','rènshi','[]','Taniltsah','To know/recognize',1,'verb','很高兴认识你。','Hěn gāoxìng rènshi nǐ.','Chamtai taniltsand bayartai.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (39,'高兴','gāoxìng','gāoxìng','[]','Bayartai','Happy',1,'adjective','我很高兴。','Wǒ hěn gāoxìng.','Bi mash bayartai.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (40,'哪','nǎ','nǎ','[]','Ali','Which',1,'pronoun','你是哪国人？','Nǐ shì nǎ guó rén?','Chi als ulsyn hün be?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (41,'国','guó','guó','[]','Uls','Country',1,'noun','中国很大。','Zhōngguó hěn dà.','Hyatad uls tom.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (42,'很','hěn','hěn','[]','Mash','Very',1,'adverb','天气很冷。','Tiānqì hěn lěng.','Tsag agaar mash hüiten.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (43,'这','zhè','zhè','[]','Ene','This',1,'pronoun','这是我的妈妈。','Zhè shì wǒ de māma.','Ene minii eej.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (44,'那','nà','nà','[]','Ter','That',1,'pronoun','那是我爸爸。','Nà shì wǒ de bàba.','Ter minii aav.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (45,'谁','shéi','shéi','[]','Hen','Who',1,'pronoun','他是谁？','Tā shì shéi?','Ter hen be?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (46,'爸爸','bàba','bàba','[]','Aav','Father',1,'noun','我爸爸很忙。','Wǒ bàba hěn máng.','Minii aav mash zavgui.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (47,'妈妈','māma','māma','[]','Eej','Mother',1,'noun','妈妈在家。','Māma zài jiā.','Eej gereetee.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (48,'女儿','nǚ''ér','nǚ''ér','[]','Ohin','Daughter',1,'noun','我有一个女儿。','Wǒ yǒu yí ge nǚ''ér.','Nadad neg ohin baina.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (49,'儿子','érzi','érzi','[]','Hüü','Son',1,'noun','他儿子七岁。','Tā érzi qī suì.','Tuunii hüü doloon nastai.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (50,'先生','xiānsheng','xiānsheng','[]','Noön','Mr./Sir',1,'noun','王先生很好。','Wáng xiānsheng hěn hǎo.','Aga Wang mash sain.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (51,'小姐','xiǎojiě','xiǎojiě','[]','Hatagtai','Miss',1,'noun','李小姐在北京。','Lǐ xiǎojiě zài Běijīng.','Li hatagtai Beejingd.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (52,'朋友','péngyou','péngyou','[]','Naiz','Friend',1,'noun','他是我的朋友。','Tā shì wǒ de péngyou.','Ter minii naiz.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (53,'医生','yīshēng','yīshēng','[]','Emch','Doctor',1,'noun','妈妈是医生。','Māma shì yīshēng.','Eej emch.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (54,'哪儿','nǎr','nǎr','[]','Haana','Where',1,'pronoun','你去哪儿？','Nǐ qù nǎr?','Chi haasha yavah ve?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (55,'学校','xuéxiào','xuéxiào','[]','Surguuli','School',1,'noun','我在学校学习。','Wǒ zài xuéxiào xuéxí.','Bi surguulid suraltsana.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (56,'汉语','Hànyǔ','Hànyǔ','[]','Hyatad hel','Chinese language',1,'noun','我会说汉语。','Wǒ huì shuō Hànyǔ.','Bi hyatadaar yarij chaddag.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (57,'今年','jīnnián','jīnnián','[]','Ene jil','This year',1,'noun','今年我二十岁。','Jīnnián wǒ èrshí suì.','Ene jil bi hoyor nastai.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (58,'几','jǐ','jǐ','[]','Hed','How many/which',1,'pronoun','现在几点？','Xiànzài jǐ diǎn?','Odoo hed tsag ve?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (59,'岁','suì','suì','[]','Nas','Years old',1,'noun','你几岁？','Nǐ jǐ suì?','Chi hed nastai ve?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (60,'多大','duō dà','duō dà','[]','Hedeen nastai','How old',1,'phrase','你多大？','Nǐ duō dà?','Chi hed nastai ve?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (61,'四','sì','sì','[]','Döröw','Four',1,'number','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (62,'五','wǔ','wǔ','[]','Taw','Five',1,'number','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (63,'六','liù','liù','[]','Zurgaa','Six',1,'number','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (64,'七','qī','qī','[]','Doloo','Seven',1,'number','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (65,'八','bā','bā','[]','Naim','Eight',1,'number','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (66,'九','jiǔ','jiǔ','[]','Yos','Nine',1,'number','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (67,'十','shí','shí','[]','Araw','Ten',1,'number','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (68,'零','líng','líng','[]','Teg','Zero',1,'number','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (69,'会','huì','huì','[]','Chaddag','Can/able to',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (70,'读','dú','dú','[]','Unshih','To read',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (71,'写','xiě','xiě','[]','Bichih','To write',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (72,'听','tīng','tīng','[]','Sonsooh','To listen',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (73,'能','néng','néng','[]','Chadah','Can/able',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (74,'一点儿','yìdiǎnr','yìdiǎnr','[]','Jaahan','A little',1,'phrase','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (75,'字','zì','zì','[]','Üseg/Temdeg','Character',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (76,'和','hé','hé','[]','Ba/bolon','And',1,'conjunction','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (77,'今天','jīntiān','jīntiān','[]','Önöödör','Today',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (78,'号','hào','hào','[]','Saryn ödör','Date/number',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (79,'月','yuè','yuè','[]','Sar','Month',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (80,'星期','xīngqī','xīngqī','[]','Doloo honog','Week',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (81,'明天','míngtiān','míngtiān','[]','Маргааш','Tomorrow',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (82,'昨天','zuótiān','zuótiān','[]','Öchigdör','Yesterday',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (83,'年','nián','nián','[]','Jil','Year',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (84,'日','rì','rì','[]','Ödör','Day/date',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (85,'想','xiǎng','xiǎng','[]','~maar baina','Want/think',1,'verb','我想喝茶。','Wǒ xiǎng hē chá.','Bi tsai uumaar baina.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (86,'茶','chá','chá','[]','Tsai','Tea',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (87,'杯子','bēizi','bēizi','[]','Ayaga','Cup/glass',1,'noun','一杯水。','Yì bēi shuǐ.','Neg ayaga us.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (88,'水','shuǐ','shuǐ','[]','Us','Water',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (89,'米饭','mǐfàn','mǐfàn','[]','Budaatai hool','Rice',1,'noun','我喜欢米饭。','Wǒ xǐhuan mǐfàn.','Bi budatai hool dortoi.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (90,'菜','cài','cài','[]','Hool/Nogoo','Dish/vegetable',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (91,'苹果','píngguǒ','píngguǒ','[]','Alim','Apple',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (92,'水果','shuǐguǒ','shuǐguǒ','[]','Jims','Fruit',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (93,'在','zài','zài','[]','~d baina','At/in',1,'preposition','我在家。','Wǒ zài jiā.','Bi gereetei.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (94,'工作','gōngzuò','gōngzuò','[]','Ajil/Ajillah','Work',1,'verb','他在医院工作。','Tā zài yīyuàn gōngzuò.','Ter emnellegt ajillana.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (95,'医院','yīyuàn','yīyuàn','[]','Emnelleg','Hospital',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (96,'商店','shāngdiàn','shāngdiàn','[]','Delgüür','Shop/store',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (97,'后面','hòumian','hòumian','[]','Ard/Hoino','Behind',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (98,'前面','qiánmian','qiánmian','[]','Ömnö','In front',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (99,'里面','lǐmian','lǐmian','[]','Dotor','Inside',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (100,'上','shàng','shàng','[]','Deer','Up/on',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (101,'下','xià','xià','[]','Door','Down/under',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (102,'坐','zuò','zuò','[]','Suuh','To sit',1,'verb','请坐。','Qǐng zuò.','Suugaarai.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (103,'这儿','zhèr','zhèr','[]','End','Here',1,'pronoun','我在这儿。','Wǒ zài zhèr.','Bi end baina.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (104,'那儿','nàr','nàr','[]','Tend','There',1,'pronoun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (105,'桌子','zhuōzi','zhuōzi','[]','Shiree','Table/desk',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (106,'椅子','yǐzi','yǐzi','[]','Sandal','Chair',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (107,'书','shū','shū','[]','Nom','Book',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (108,'些','xiē','xiē','[]','Zarim neg','Some',1,'pronoun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (109,'本','běn','běn','[]','(nom tooloh)','(measure word for books)',1,'measure_word','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (110,'现在','xiànzài','xiànzài','[]','Odoo','Now',1,'noun','现在八点半。','Xiànzài bā diǎn bàn.','Odoo naim gantshan.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (111,'点','diǎn','diǎn','[]','Tseg/Tsag','O''clock/dot',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (112,'分钟','fēnzhōng','fēnzhōng','[]','Minut','Minute',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (113,'时候','shíhou','shíhou','[]','Üe/Tsag','Time/moment',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (114,'上午','shàngwǔ','shàngwǔ','[]','Öglöö','Morning/AM',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (115,'下午','xiàwǔ','xiàwǔ','[]','Ödriin hoid','Afternoon/PM',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (116,'中午','zhōngwǔ','zhōngwǔ','[]','Üd dund','Noon',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (117,'回','huí','huí','[]','Butsah','To return',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (118,'做','zuò','zuò','[]','Hiih','To do/make',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (119,'打电话','dǎ diànhuà','dǎ diànhuà','[]','Utsaar yarih','Make a phone call',1,'phrase','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (120,'天气','tiānqì','tiānqì','[]','Tsag agaar','Weather',1,'noun','今天天气怎么样？','Jīntiān tiānqì zěnmeyàng?','Önöödör tsag agaar yaamar baina?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (121,'怎么样','zěnmeyàng','zěnmeyàng','[]','Yaaj/Yamar','How about/How',1,'pronoun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (122,'太','tài','tài','[]','Hetherhii','Too (much)',1,'adverb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (123,'热','rè','rè','[]','Haluun','Hot',1,'adjective','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (124,'冷','lěng','lěng','[]','Hüiten','Cold',1,'adjective','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (125,'下雨','xià yǔ','xià yǔ','[]','Boroo oroh','To rain',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (126,'多','duō','duō','[]','olon/Ih','Many/much',1,'adjective','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (127,'少','shǎo','shǎo','[]','Tsöön/Baga','Few/little',1,'adjective','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (128,'学习','xuéxí','xuéxí','[]','Suraltsah','To study',1,'verb','他喜欢学习。','Tā xǐhuan xuéxí.','Ter suraltsmagd dostoi.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (129,'呢','ne','ne','[]','~yuu? (asuuh)','(question particle)',1,'particle','你呢？','Nǐ ne?','Chi yaamar baina?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (130,'喜欢','xǐhuan','xǐhuan','[]','Durtai','To like',1,'verb','我喜欢看电视。','Wǒ xǐhuan kàn diànshì.','Bi televis üzehd dortoi.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (131,'爱','ài','ài','[]','Hairlah','To love',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (132,'电影','diànyǐng','diànyǐng','[]','Kino','Movie',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (133,'电视','diànshì','diànshì','[]','Televiz','Television',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (134,'电脑','diànnǎo','diànnǎo','[]','Kompyuter','Computer',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (135,'东西','dōngxi','dōngxi','[]','Yum/Züjl','Thing/stuff',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (136,'买','mǎi','mǎi','[]','Hudaldaj awah','To buy',1,'verb','我买了一个苹果。','Wǒ mǎi le yí ge píngguǒ.','Bi neg alim awsan.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (137,'了','le','le','[]','(duussan)','(completed action particle)',1,'particle','他来了。','Tā lái le.','Ter irsen.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (138,'衣服','yīfu','yīfu','[]','Huwtsas','Clothes',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (139,'钱','qián','qián','[]','Mönög','Money',1,'noun','我没有钱。','Wǒ méiyǒu qián.','Nadad mönög baihgüi.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (140,'块','kuài','kuài','[]','Tögrög/yuan','Yuan/piece',1,'measure_word','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (141,'多少','duōshao','duōshao','[]','Hed/Hedeen','How many/much',1,'pronoun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (142,'个','gè','gè','[]','(tooloh üg)','(general measure word)',1,'measure_word','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (143,'漂亮','piàoliang','piàoliang','[]','Üzesgelengtei','Beautiful',1,'adjective','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (144,'飞机','fēijī','fēijī','[]','Ongots','Airplane',1,'noun','我坐飞机去北京。','Wǒ zuò fēijī qù Běijīng.','Bi ongotsoor Beejing yavna.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (145,'出租车','chūzūchē','chūzūchē','[]','Taksi','Taxi',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (146,'火车','huǒchē','huǒchē','[]','Galt tereg','Train',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (147,'住','zhù','zhù','[]','Ajildrah/Bairlah','To live',1,'verb','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (148,'家','jiā','jiā','[]','Ger','Home/family',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (149,'北京','Běijīng','Běijīng','[]','Beejing','Beijing',1,'noun','','','',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (150,'怎么','zěnme','zěnme','[]','Yaaj/Yagaad','How/why',1,'pronoun','你怎么去学校？','Nǐ zěnme qù xuéxiào?','Chi yaaj surguuld ochdog ve?',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (151,'都','dōu','dōu','[]','Bugd','All/both',1,'adverb','我们都在家。','Wǒmen dōu zài jiā.','Bid bugd gereetei.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (152,'没','méi','méi','[]','Ügüi (öngrösun)','Not (past)',1,'adverb','他没去北京。','Tā méi qù Běijīng.','Ter Beejing yavsangui.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (153,'没有','méiyǒu','méiyǒu','[]','Baihgüi','Don''t have',1,'verb','我没有时间。','Wǒ méiyǒu shíjiān.','Nadad tsag baihgüi.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (154,'有','yǒu','yǒu','[]','Baina/Bii','To have',1,'verb','我有一本书。','Wǒ yǒu yì běn shū.','Nadad neg nom baina.',0);
INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count) VALUES (155,'睡觉','shuìjiào','shuìjiào','[]','Untah','To sleep',1,'verb','我要睡觉。','Wǒ yào shuìjiào.','Bi unthmaar baina.',0);

-- RESTRUCTURE LESSONS (chapter 1 only)

DELETE FROM lesson_words WHERE lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 1);
DELETE FROM user_lesson_progress WHERE lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 1);
DELETE FROM lessons WHERE chapter_id = 1;

-- 15 HSK 1 LESSONS

INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (100, 1, 'Мэндчилгээ', 'Нэгж 1 · Мэндчилгээ (你好)', 'hand-right', 1, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (101, 1, 'Талархал', 'Нэгж 2 · Талархал ба уучлал (谢谢)', 'heart', 2, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (102, 1, 'Нэр хэлэх', 'Нэгж 3 · Тоотой асуулт ба нэр (名字)', 'people', 3, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (103, 1, 'Танилцуулга', 'Нэгж 4 · Гэр бүл, мэргэжил (朋友)', 'school', 4, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (104, 1, 'Нас, гэр бүл', 'Нэгж 5 · Олон тоо, нас (岁)', 'calendar', 5, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (105, 1, 'Чадвар', 'Нэгж 6 · Чадвар илэрхийлэх (会)', 'chatbubbles', 6, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (106, 1, 'Огноо', 'Нэгж 7 · Огноо, долоо хоног (今天)', 'time', 7, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (107, 1, 'Хоол хүсэл', 'Нэгж 8 · Идэх, уух (想/喝)', 'cafe', 8, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (108, 1, 'Ажил байршил', 'Нэгж 9 · Ажил, байршил (在)', 'business', 9, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (109, 1, 'Зөвшөөрөл', 'Нэгж 10 · Тоотой асуулт ба зөвшөөрөл (吗)', 'hand-left', 10, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (110, 1, 'Цаг хугацаа', 'Нэгж 11 · Цаг, хуваарь (现在)', 'alarm', 11, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (111, 1, 'Цаг агаар', 'Нэгж 12 · Цаг агаар (天气)', 'cloud', 12, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (112, 1, 'Суралцах', 'Нэгж 13 · Одоогийн үйлдэл (呢)', 'book', 13, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (113, 1, 'Дэлгүүр', 'Нэгж 14 · Худалдан авалт, тоо (买/了)', 'cart', 14, 1);
INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES (114, 1, 'Аялал', 'Нэгж 15 · Аялал, тээвэр (飞机)', 'airplane', 15, 1);

-- LESSON-WORD MAPPINGS

-- Lesson 1: 你好
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 1, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 4, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 5, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 6, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 7, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 8, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 9, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 10, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 26, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (100, 16, 10);

-- Lesson 2: 谢谢你
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 2, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 3, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 27, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 28, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 29, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 30, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 31, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 32, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 33, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (101, 34, 10);

-- Lesson 3: 你叫什么名字？
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 35, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 36, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 37, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 38, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 39, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 40, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 41, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 13, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 14, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (102, 42, 10);

-- Lesson 4: 她是我的汉语老师
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 15, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 43, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 44, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 45, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 46, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 47, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 52, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 53, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 54, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (103, 55, 10);

-- Lesson 5: 她女儿今年二十岁
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 56, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 57, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 58, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 59, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 60, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 48, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 49, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 50, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 51, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (104, 61, 10);

-- Lesson 6: 我会说汉语
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 25, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 69, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 70, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 71, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 72, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 73, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 74, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 75, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 76, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (105, 62, 10);

-- Lesson 7: 今天几号？
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 77, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 78, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 79, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 80, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 81, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 82, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 83, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 84, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 63, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (106, 64, 10);

-- Lesson 8: 我想喝茶
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 85, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 21, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 86, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 87, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 88, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 20, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 89, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 90, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 91, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (107, 92, 10);

-- Lesson 9: 你儿子在哪儿工作？
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 93, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 94, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 95, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 96, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 97, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 98, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 99, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 100, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 101, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (108, 65, 10);

-- Lesson 10: 我能坐这儿吗？
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 102, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 103, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 104, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 105, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 106, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 107, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 108, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 109, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 66, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (109, 67, 10);

-- Lesson 11: 现在几点？
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 110, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 111, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 112, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 113, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 114, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 115, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 116, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 117, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 118, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (110, 119, 10);

-- Lesson 12: 明天天气怎么样？
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 120, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 121, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 122, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 123, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 124, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 125, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 11, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 12, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 126, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (111, 127, 10);

-- Lesson 13: 他在学做中国菜呢
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 128, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 129, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 130, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 131, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 24, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 132, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 133, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 134, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 135, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (112, 68, 10);

-- Lesson 14: 她买了不少衣服
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 136, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 137, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 138, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 139, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 140, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 141, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 142, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 143, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 17, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 18, 10);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 19, 11);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 152, 12);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 153, 13);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 154, 14);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (113, 155, 15);

-- Lesson 15: 我是坐飞机来的
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 144, 1);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 22, 2);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 23, 3);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 145, 4);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 146, 5);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 147, 6);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 148, 7);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 149, 8);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 150, 9);
INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) VALUES (114, 151, 10);

-- UPDATE CHAPTER
UPDATE chapters SET title_mn = 'HSK 1 — Бүрэн курс', subtitle_mn = 'Хятад хэлний анхан шат (150 үг, 15 хичээл)' WHERE id = 1;
