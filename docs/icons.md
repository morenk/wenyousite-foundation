# 图标目录与治理

本目录由 `contracts/foundation.v1.json` 与 `lucide-static@1.28.0` 生成。产品代码使用语义 ID，不直接把 Lucide 图形名当作业务含义。

## 使用规则

- Web 与 Flutter 必须消费 Foundation 生成产物；第三方编辑器使用同源 SVG 字符串，不手写近似路径。
- 交互状态由控件容器表达；选中态保持同一图形，使用柔粉背景和前景色。
- 有文字的控件由控件承担可访问名称，内部图标隐藏；独立图标按钮必须提供明确名称。
- 新增语义前先搜索本目录。同一图形可以承载多个经过审查的近义语义，但同一语义只能映射一个图形。
- 品牌标识、分类标记、插画和操作系统专属动作属于显式例外，不进入核心 UI 图标映射。

## 版本与视觉规格

- 图标家族：Lucide
- 固定版本：1.28.0
- 画板：0 0 24 24
- 默认线宽：2
- 尺寸角色：紧凑 16、默认 20、导航 24

## 语义目录

| 语义 ID | SVG 图形 | SHA-256 |
| --- | --- | --- |
| `navigation.home` | `house` | `6f66096479bb2a1a8c261e9eed435c35e7fcb52bf1e537ee83be351c76544b5c` |
| `navigation.moments` | `sparkles` | `667eb1a2a7853e7b6345c45e2343d4f48cbdcede9ce4f62c58bc8388ebbe90d0` |
| `navigation.publish` | `plus` | `3b74adc0a37118240d587bf18d73a27f030ae1ce5c4db6fe7423212cf9f5ee49` |
| `navigation.messages` | `message-circle` | `23e672401dc377141d22c8fd1d669a6b3a850399c8aa999379c3ef83043d00a7` |
| `navigation.profile` | `user-round` | `73b71ea68d98f9b358bdcde28037b5c7a49da3b2923e39a57cde19b5b25fe2ba` |
| `navigation.back` | `arrow-left` | `6b132abec275b09136d6db20b60362a24f8fd4c5f2f677d6a1d4e2904732b978` |
| `navigation.forward` | `arrow-right` | `dbe9941fd1e97f1287ee300913be672cb2fe4f65ac7c6fe71653dd350db39c6e` |
| `navigation.previous` | `chevron-left` | `f533d8319aa5a9daf021dafe70aa4ca3870240f04519019027a6eea6b248255e` |
| `navigation.next` | `chevron-right` | `be2bf697096337117d159a318b6cb472ea56b0a0b86005c33b51d58d0764e374` |
| `navigation.expand` | `chevron-down` | `cc59159680b8cb6b62968db60c31c24bf4070c9da54ef3fe8d5a6ca8725dc9e9` |
| `navigation.collapse` | `chevron-up` | `7ce9cd497e65604a61584f0b0a0fbac81b34101b496779c6da724ff82c42b1ab` |
| `navigation.up` | `arrow-up` | `8237bde9c848ca98025944b4bdc324842742255271b30bacb8f29d44e7708fd8` |
| `navigation.down` | `arrow-down` | `6220ca24251cdd5201ad5627ca2b354cb1ef7292dc4d0f8b09fdf86b55a84d2d` |
| `navigation.explore` | `compass` | `24a56af272223d76d60687c5191e6ef15fd0e4cd6a52f0a9237a6a77abaf678b` |
| `action.add` | `plus` | `3b74adc0a37118240d587bf18d73a27f030ae1ce5c4db6fe7423212cf9f5ee49` |
| `action.add-comment` | `message-square-plus` | `f8058ae58b496d80beae5bd6fb3db3f7353bf215fe09b753ee93f2fc0acc96b2` |
| `action.add-reaction` | `smile-plus` | `8e41610de1f2c686c000cc771f7a52893f5e4faecbfe0b1c503a555d41b6fba1` |
| `action.add-tag` | `tag-plus` | `1c56314c29c63d959dd0bbb73ef6f9242d8f7b8df2144f31fd4140536ae91864` |
| `action.confirm` | `check` | `48193329bff31b22c614630b20bd6a426bc60d6a65343a74c84c16fd86f086b4` |
| `action.edit` | `pencil` | `8db295372b8afe5eb9dcf3b74ca8bb99233bc9fbe2a98062e75f7da588c87efb` |
| `action.disable-edit` | `pencil-off` | `193194362ba22b6bcacd5263257c399fbcaae8b831a643490974dd8d5fe3087b` |
| `action.delete` | `trash-2` | `787a4966a7ea9e2c84ef3ffadf3358565f50731f4205197566abba3a79e74214` |
| `action.save` | `save` | `0003c8e8832a64628bad5e2130574ab999620bb1c7410a4030c4f51e49dda31b` |
| `action.save-all` | `save-all` | `dcd41bae40570fbcc064b563c3b312364e89e3d7721992c90a55187accfe82c1` |
| `action.send` | `send` | `e986f8a0eca1c7ba7227a375d55403979e81009d4e011ce11a85d945dba9d59b` |
| `action.search` | `search` | `f36461346798a05ac92c5bdd477a99c5eebf17c72c851ab9ede0703de2a39637` |
| `action.filter` | `list-filter` | `f50604bf38baecdcbeef9a8fe1c6535584df7a8c17b46283fd74583e7b418a21` |
| `action.clear-filter` | `list-x` | `5c75aa3ec19972c11b1ec91a16bd7e035e19ee9f603802833bc73961cd6ad149` |
| `action.sort` | `arrow-down-up` | `007dd379897c391bd76f2bc519b90ebf0b3f49f2b11389cc143e01eed563fe3c` |
| `action.refresh` | `refresh-cw` | `9b176420920c88de7b1bc3904b54c33b4f2e5c71a44ebca0f03861fcefc83397` |
| `action.sync` | `refresh-ccw` | `f1fe6495690d51a607e8b58b26be23c9da4c010be335dcc69c3c1da013fad875` |
| `action.undo` | `undo-2` | `32746fad909ccf27d387bd304122e7903963a8bde414041c36673d3295923aa6` |
| `action.close` | `x` | `f90eb6b04596e70b2f3752684be5ec2b75a871dd4cf45a8eee792aad7263a612` |
| `action.more` | `ellipsis` | `918bc1045886f9ac4070b5fca49eff5a33d69c5a86854bcd9fbf14a795d9c511` |
| `action.copy` | `copy` | `b83fdea5841bd0c800cf6977ea248b812fa15b3d61ecca935f9e85f359789646` |
| `action.copy-all` | `copy-plus` | `28cda8428b627268cf54b234ce768d477cd551f851dbabeec0cb773b30e6f520` |
| `action.download` | `download` | `de2b9cb905656d6f27b131b3514b7bac4b513c9e8bf85d4b3277132f1bc321f7` |
| `action.upload` | `upload` | `842eb41f3c43231f16ff37295ebf15bfed5c2419978767aba63cc5dd690b7271` |
| `action.share` | `share-2` | `c820977d9df79d304379a61cf15b5b149b16e0dc096681b019454e70fda64787` |
| `action.reply` | `reply` | `40be184247842cc46b1637ca042ac562d29aa1ae4381d0184c8ec15c6b86ca9d` |
| `action.open-external` | `external-link` | `49982b8caf1a6801f8160c336739b29f9de4090b4115244ce9eaed38b2b18da4` |
| `action.fullscreen` | `maximize` | `b252950824d47777a29b1af89452378527a1b3adc680bdb13050bf61a3bdca33` |
| `action.exit-fullscreen` | `minimize` | `1b3959aa83afdcd26e19f1c180df1ea9c8d9aeeee9922fc570bb1fd6535864af` |
| `action.move` | `folder-input` | `7fa1e6d11d45e8435365a2aa7eac870cbe101d3b718538cc58234f390df17a75` |
| `action.reorder` | `grip-horizontal` | `f35c83929b69d874e16dd1253fc3ee973e7ee1e9ce0e20213e68300870eeaff3` |
| `action.archive` | `archive` | `d7e333c7bf7ef2fcc99bad1f0fbe60a38064c02d2f08a3d19f0a27c2f3123939` |
| `action.unarchive` | `archive-restore` | `9ee4cdc5033a7b50a7e5bb5709ce13510a7d1f8c3a9a32973b4d5a89f1bcd759` |
| `action.restore` | `archive-restore` | `9ee4cdc5033a7b50a7e5bb5709ce13510a7d1f8c3a9a32973b4d5a89f1bcd759` |
| `action.pin` | `pin` | `e808dc9ff0925654149d034d5b51ccbb4c915510a014e969db41d2c8ad50d4ed` |
| `action.report` | `flag` | `c73ca68240ea29106b4694748e01de503516bbd91c15bcfaf49243dc54a8f662` |
| `action.block` | `ban` | `ccb7543486de959c1e9490932f36e3891c4ce84e8575afefd7fff90cac5966be` |
| `action.follow` | `user-plus` | `50166f2032718c6a9207eeceff53b221cb40172a217bbb0bbb7280b7ac68e201` |
| `action.unfollow` | `user-minus` | `48acf1487228dca6a86b33af506aa552813b4aae4bf8752db2d756a5b73b6326` |
| `action.bookmark` | `bookmark` | `0cb65566a3db0a7166a3519d944d24d7961343ef0ac63abd63713c1d51ad8e9e` |
| `action.remove-bookmark` | `bookmark-x` | `05b66b7cb71f72d6d36fda5c4a6a56621a8c319a701febe7f34387c5b698f922` |
| `action.remove-tag` | `tag-x` | `eea9f5920fd64baa602c1eb02b8f754b512723471030773492526926df6f5739` |
| `action.like` | `heart` | `0ab65b58eba253f9e7f2eb6dafcd78ffa91277b45b69ba92f78cce209b473f07` |
| `action.tip` | `fuel` | `9f2840595e35b3893eaddd4995716e732cbda6c65bef9c1536004f9f2b28751e` |
| `action.redeem` | `gift` | `0652ace11ff3cbddf9f9c3bb9086029a2dc56b6feaf08fe7fe8aef8753a7c8f1` |
| `action.image` | `image` | `d5ce3e3df40895e0a851482bc78080a58459112c954fe12c45e047dbaae1fa01` |
| `action.add-image` | `image-plus` | `8692e8bee1ef01bfffa77776ca05d40f49039d916c66fb443548ef4146c0f108` |
| `action.sticker` | `smile-plus` | `8e41610de1f2c686c000cc771f7a52893f5e4faecbfe0b1c503a555d41b6fba1` |
| `action.folder` | `folder` | `dd11c6d9a79bc820322b1d32b5b3f40a8994034ebd04f30e9183e9b8ab10ea15` |
| `action.add-folder` | `folder-plus` | `0d2f3c7b51ace0ac0df4acefe4a257272c44b18d8d2c4d660adfed2c3f0cd790` |
| `action.unlink` | `unlink` | `96ce50a33f92fad95b2e73b606c7ad254ce11311df789e3e3b3e4094642cc441` |
| `action.mention` | `at-sign` | `cfed4b2c8624f05094aff5ecb7dd284609143d931c1eddb026cfed4062d919a0` |
| `action.show` | `eye` | `1469f198d32e5f42fcafb461c3caac42fcdbdf164e38c46b3b46ca512c702310` |
| `action.hide` | `eye-off` | `b62f1ab4e46b499906ea79ddaddb69d6853f23250f2d77d86d496eb487655850` |
| `action.login` | `log-in` | `760b6ad29571c6575942b178f4282d595fcb4c672e7e055cb33252defc70b43a` |
| `action.logout` | `log-out` | `424d8f91ce8eb52be927914c824c5d629610ccdc751fadf2d20c2d6a2823319d` |
| `action.settings` | `settings` | `8fa0a1da85e88c6a5b0dbb6b91d15d24cef989a379e1eaa0bd230b1a4cd0ade4` |
| `action.account` | `user-round-cog` | `66e0fa52c836c82be59797fa3b3bef3dda132958e90545d7a931435a3d3f1ad8` |
| `action.lock` | `lock-keyhole` | `682acf1b4735e5b2868b8904e33ebd69dd2e1f7e5e3259fcc5c9442396bc65e0` |
| `action.unlock` | `lock-keyhole-open` | `6f1a6f7460c4244d28269ea05f5ade4c4213f972746d9a63f17edb85d61b3ef2` |
| `action.reset-password` | `key-round` | `fb37758a4a3c23dc2de7c998170b072a99d165156cdbe2354622a68250044e7a` |
| `action.devices` | `monitor-smartphone` | `1eedc1648a01bc1cb0e6f199ed87b3ea8d4b5b5407186d506ce1c7a828133a35` |
| `action.mark-read` | `mail-check` | `e68c9ad77ef2a5a98243957042a8dfdf5b4e9e759a7a6dd522c3cb746dab53fd` |
| `action.mark-unread` | `mail-open` | `6aa1ca48c8b2bf26ca5b94a535afab9202dc93048075246f4296b17f75450a28` |
| `action.update` | `cloud-download` | `11025e7f2f0c72208dddc3081e9e450f5b1f6d0b32f94a0e9d089e47e56d3f9f` |
| `content.announcement` | `megaphone` | `3f88f54e12d130a1666141f72611c28a86a2c413be900bc2661efcc16f3b62ad` |
| `content.article` | `newspaper` | `13e528c20bc837013bf83aee83d85adead6bf477a8747a4d2509428eb2d9612e` |
| `content.category` | `shapes` | `6d4c1da6c0d8ef449850454d7832c583e5025839266bb403fc840a2253c5716e` |
| `content.draft` | `file-clock` | `0dc0120d5218b24d06c5a0c96d18b6dedc86be1127b94877b6870705840ec4cb` |
| `content.folder` | `folder` | `dd11c6d9a79bc820322b1d32b5b3f40a8994034ebd04f30e9183e9b8ab10ea15` |
| `content.folder-open` | `folder-open` | `2bb84e7613a3987add5e7acffc51b7506454f83a186525d42179c7767278194a` |
| `content.gallery` | `images` | `34ab979c08108dd367cb19acbbe5253dff91be3aab0f98273aabdaa32ef4c69b` |
| `content.invitation` | `mail-plus` | `ef5db89abcc1b2e9c0d3a2fe47c0a202b825e38646a3882f4be3302f3dedfcd7` |
| `content.layers` | `layers` | `96688ab27c552989c2e39424ada4f7ad295d239f41a11ccaf926e9dccc4f563f` |
| `content.list` | `list` | `e10c1b8ee76dd75cb02dfd84615ff0c9adbce5e5ac232fa3b9f1452b2424bba3` |
| `content.moment` | `sparkles` | `667eb1a2a7853e7b6345c45e2343d4f48cbdcede9ce4f62c58bc8388ebbe90d0` |
| `content.review` | `notebook-pen` | `a15095743e75a53d63c94d023b08ae9c5d7344b84134ee39b7c403a744d4cb8a` |
| `content.roleplay` | `drama` | `411edc400762765c12db7cdc86c4d37d727a408c27e9b18aa0d330dd1b514cef` |
| `content.tag` | `tag` | `6a53dac24e6728449f34b57bfce6315b8c1af8fcc6c2f96af3eb77768693f175` |
| `content.thread` | `message-square` | `b27758991f50b1d79149e5eac616d794cf37ae07ccfff439dbc2cf47e6a275e6` |
| `content.topic` | `notebook-text` | `809cbd237584d92a094d9916815fc55ddb0d09f3c60e756493832804dc564002` |
| `economy.reward` | `gift` | `0652ace11ff3cbddf9f9c3bb9086029a2dc56b6feaf08fe7fe8aef8753a7c8f1` |
| `economy.tip` | `fuel` | `9f2840595e35b3893eaddd4995716e732cbda6c65bef9c1536004f9f2b28751e` |
| `economy.transaction` | `receipt-text` | `b7b0a1dd5538bfd8871240577831300d3b12880bdf9d1dcbde0cd3272fd3d995` |
| `economy.wallet` | `wallet-cards` | `2d987ecedcfeae35938f30f8933c69434c93c83a8917a8a3b70e8408705e31a6` |
| `identity.level` | `badge` | `cb0322cd58ca2513a4582454933a33bd867911f9b73a20ced532ef71aa5d60a0` |
| `identity.member` | `user-round` | `73b71ea68d98f9b358bdcde28037b5c7a49da3b2923e39a57cde19b5b25fe2ba` |
| `identity.members` | `users` | `289a132782c5ecafb922769988fa9a7ffbd33cf462a447947958aff3a09ff030` |
| `moderation.appeal` | `scale` | `72816f2172b6cdb40905d97fdfad4e5f965d1e28e483967faa1eaba19d755d7b` |
| `moderation.decision` | `gavel` | `c597115c29707a5fd50914ce88d7a7660ed8e13d02183a898626930120f888eb` |
| `security.device-desktop` | `laptop` | `f8c354191301ddd222525d874cbe45985f1143c7ed1b5ff0d05d0579a738cbc3` |
| `security.device-mobile` | `smartphone` | `cc983aff826e9f7e3ad4c8d1f510ffdf92113f0100972ad3fe587af5274bae62` |
| `security.password` | `key-round` | `fb37758a4a3c23dc2de7c998170b072a99d165156cdbe2354622a68250044e7a` |
| `metric.comments` | `message-circle` | `23e672401dc377141d22c8fd1d669a6b3a850399c8aa999379c3ef83043d00a7` |
| `metric.likes` | `heart` | `0ab65b58eba253f9e7f2eb6dafcd78ffa91277b45b69ba92f78cce209b473f07` |
| `metric.players` | `users` | `289a132782c5ecafb922769988fa9a7ffbd33cf462a447947958aff3a09ff030` |
| `metric.replies` | `message-square` | `b27758991f50b1d79149e5eac616d794cf37ae07ccfff439dbc2cf47e6a275e6` |
| `metric.tips` | `fuel` | `9f2840595e35b3893eaddd4995716e732cbda6c65bef9c1536004f9f2b28751e` |
| `metric.views` | `eye` | `1469f198d32e5f42fcafb461c3caac42fcdbdf164e38c46b3b46ca512c702310` |
| `editor.heading` | `type` | `40eece0115c92cbf8ea4c0e6f5561a32e8676e81b67c98a7d02f2c937a60753d` |
| `editor.heading-2` | `heading-2` | `a99abf77b3c53f48f02c8003d71678714e7b229c220ee60b7169b28c98447c42` |
| `editor.heading-3` | `heading-3` | `61f552bf9e770f6bb4c751240ac05ebb09601a9ecf886767f3537a34719ed1b3` |
| `editor.bold` | `bold` | `d5a99970ec7a77236954348619a4d6cba7b7c209dce37bd6342c768598cb8ba8` |
| `editor.italic` | `italic` | `4da9491e026b38e6c5549d870f696f26167571fecb0f001963f898c29ba55cd8` |
| `editor.strikethrough` | `strikethrough` | `912253c524af5503f619c06abe5125038c58c7e776454d6c7690efcc8f7e2327` |
| `editor.inline-code` | `code-2` | `ced47e4bb7028f988ee680fe56909f39446297c0d0cf2b749e611ab97919201d` |
| `editor.bullet-list` | `list` | `e10c1b8ee76dd75cb02dfd84615ff0c9adbce5e5ac232fa3b9f1452b2424bba3` |
| `editor.ordered-list` | `list-ordered` | `6242286c31f25c70d9a211b5eacb316fe681bc9b13ea9bff906d96fe907f791b` |
| `editor.link` | `link-2` | `60abd81ef577b13bf6b74ac84b9737df341ae21e8f1ca50cf310d33b8557f7a9` |
| `editor.image` | `image` | `d5ce3e3df40895e0a851482bc78080a58459112c954fe12c45e047dbaae1fa01` |
| `editor.quote` | `quote` | `b53e29e20d5fc7677c8f8e0bd446e269f0c51e1fb7d4ea6c319b44a03345cc9e` |
| `editor.horizontal-rule` | `minus` | `54a2700b8c11bfe3c4e8542b559aa5dfe14b464d23ded80b7a6ecddd39fc7e56` |
| `editor.dice` | `dices` | `45929a46324246faa64738faa66d2fc40eb5ea2159fac8382728654849ad3814` |
| `editor.sticker` | `smile-plus` | `8e41610de1f2c686c000cc771f7a52893f5e4faecbfe0b1c503a555d41b6fba1` |
| `editor.content-drafts` | `file-clock` | `0dc0120d5218b24d06c5a0c96d18b6dedc86be1127b94877b6870705840ec4cb` |
| `editor.more` | `ellipsis` | `918bc1045886f9ac4070b5fca49eff5a33d69c5a86854bcd9fbf14a795d9c511` |
| `editor.close` | `x` | `f90eb6b04596e70b2f3752684be5ec2b75a871dd4cf45a8eee792aad7263a612` |
| `editor.chevron-down` | `chevron-down` | `cc59159680b8cb6b62968db60c31c24bf4070c9da54ef3fe8d5a6ca8725dc9e9` |
| `status.loading` | `loader-circle` | `77689bf396695c2473619f728d681276ff4c736d1f3fd201013c85cecd29aaba` |
| `status.success` | `circle-check` | `11c5c4f8a490dc9eb242eba0542a37ade95d6f06a4d93f75a3c82956c95cca47` |
| `status.info` | `info` | `60b5478d311c742801a26126bbcc8ceb022f98cf2d06665834c3d2482b8a4af0` |
| `status.warning` | `triangle-alert` | `744b90b12f5a29930a4340f030ec9f5b7d41da9f02398f480b8182c3fe8513e5` |
| `status.error` | `circle-alert` | `3ce7dd644866adb9e22c7093000e2e92c4afd18dc7b64562779242fc97efeb5e` |
| `status.offline` | `cloud-off` | `52b587f4f3e1aee7472dac4992111ed5f59a55dc9fa37f7c2d75e471c43a8973` |
| `status.synced` | `cloud-check` | `77e6c376761e8ec5d6254eb55be7ad24b2e35b312b7d898e00b090398622203c` |
| `status.syncing` | `cloud-upload` | `3586e540ea15f3d8e0af0134495a28f107f8e8c736930a3c92e673efefb0614a` |
| `status.cloud` | `cloud` | `c641191a23b4748949a89be5eb0ae7ea28058cad68e7cda1b9b2a733c6091868` |
| `status.empty` | `inbox` | `25129d8768f8f1b9408c37f910c02d91709a086f42f3267b640f9c79371a5c67` |
| `status.verified` | `badge-check` | `8199adae3a67c0ab7b41d5a3a8de648eafb591560569807048f256ae0319d12e` |
| `status.image-unavailable` | `image-off` | `aad43159459e36c0609c87e27903b33576761f81c5e798e687d49adc4c978bd8` |
| `status.no-results` | `search-x` | `8f56af245a4747628e8d8e8a6ca95a17d443e71d9042b851e2609c6faec93ff6` |
| `status.messages-disabled` | `message-circle-off` | `5fd92e420ea5cfd6042ab3f013d975e1a2abb718b146e48c13fd9b4f333efbf6` |
| `status.notifications` | `bell` | `af3facedb58dafe3909a8d517e293a1e07ca40b6294cef18edd520780103a5ac` |
| `status.notifications-active` | `bell-ring` | `c89813b0d34fa004fa4a4a9830c5b1645707779531978508bc91df90afcd4457` |
| `status.notifications-off` | `bell-off` | `ed8141466478682718299493393e9dbfa33047040f01ccc8a22f0c668810c015` |
| `status.users` | `users` | `289a132782c5ecafb922769988fa9a7ffbd33cf462a447947958aff3a09ff030` |
| `status.file` | `file-text` | `c85e9abe570c3e5bebb0b84534939d02bf6bfe84c9e6ea2d09302e190fc2a879` |
| `status.gallery` | `images` | `34ab979c08108dd367cb19acbbe5253dff91be3aab0f98273aabdaa32ef4c69b` |
| `status.tag` | `tag` | `6a53dac24e6728449f34b57bfce6315b8c1af8fcc6c2f96af3eb77768693f175` |
| `status.mail` | `mail` | `0f27fce80ec46729ce96311d8fc8a37b6619d4bc930714e842f85a72aba26a00` |
| `status.key` | `key-round` | `fb37758a4a3c23dc2de7c998170b072a99d165156cdbe2354622a68250044e7a` |
| `status.shield` | `shield` | `b919c8d139891d8d824784995f048cb46d9d081b83e7b2c08cdb98c9250887fa` |
| `status.help` | `circle-help` | `2e7f6bfc466b72e0714423f80e42af5d80fd38a4833c84837338d0f855512715` |
| `status.unavailable` | `circle-x` | `348f7dba6b9469b38c9fbc165a4ba0a7c854496f0113dccabdd85e9e1538b708` |
| `status.archived` | `archive` | `d7e333c7bf7ef2fcc99bad1f0fbe60a38064c02d2f08a3d19f0a27c2f3123939` |
| `status.blocked` | `ban` | `ccb7543486de959c1e9490932f36e3891c4ce84e8575afefd7fff90cac5966be` |
| `status.calendar` | `calendar-days` | `55e6560cce5590b4cd30212d9336224aad86902fc3f9d4ff4dfd1bf9f8c7bd40` |
| `status.email-read` | `mail-check` | `e68c9ad77ef2a5a98243957042a8dfdf5b4e9e759a7a6dd522c3cb746dab53fd` |
| `status.email-unread` | `mail-open` | `6aa1ca48c8b2bf26ca5b94a535afab9202dc93048075246f4296b17f75450a28` |
| `status.greeting` | `hand` | `8849440c7c72ce16e715f1833220020d3675302e1fff311774d926a95f30b36b` |
| `status.group-unavailable` | `users-round` | `9893bfacbda15f29511f9e8abb1496c1c961fa417579645d66826a9cc68e32a8` |
| `status.history` | `history` | `8f15ab47892ef120f9d4e0bc8d2dc5e4bbdb0d885a97f60ef4163ff6b827ad42` |
| `status.locked` | `lock-keyhole` | `682acf1b4735e5b2868b8904e33ebd69dd2e1f7e5e3259fcc5c9442396bc65e0` |
| `status.new` | `badge-alert` | `96a0a097a9cf4411bca2fb1a69bc1b2252f9c34a87d525065da0e42baa9ca83b` |
| `status.pinned` | `pin` | `e808dc9ff0925654149d034d5b51ccbb4c915510a014e969db41d2c8ad50d4ed` |
| `status.premium` | `crown` | `9d3e53dee80039152b5852ea83eb4799d85f0a46bacea23a19013436f6aba417` |
| `status.trending` | `trending-up` | `04cc883abcacdf4194c97b1afc98894ffb1d8b4fece1b896cfc505f422f85626` |
| `status.user-unavailable` | `user-round-x` | `731d219140c46931e0809dc03ef8b873d6307b18fd86eeeac06673d3751e373c` |
