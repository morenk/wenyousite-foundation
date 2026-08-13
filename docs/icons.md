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
| `action.add` | `plus` | `3b74adc0a37118240d587bf18d73a27f030ae1ce5c4db6fe7423212cf9f5ee49` |
| `action.edit` | `pencil` | `8db295372b8afe5eb9dcf3b74ca8bb99233bc9fbe2a98062e75f7da588c87efb` |
| `action.delete` | `trash-2` | `787a4966a7ea9e2c84ef3ffadf3358565f50731f4205197566abba3a79e74214` |
| `action.save` | `save` | `0003c8e8832a64628bad5e2130574ab999620bb1c7410a4030c4f51e49dda31b` |
| `action.send` | `send` | `e986f8a0eca1c7ba7227a375d55403979e81009d4e011ce11a85d945dba9d59b` |
| `action.search` | `search` | `f36461346798a05ac92c5bdd477a99c5eebf17c72c851ab9ede0703de2a39637` |
| `action.filter` | `list-filter` | `f50604bf38baecdcbeef9a8fe1c6535584df7a8c17b46283fd74583e7b418a21` |
| `action.sort` | `arrow-down-up` | `007dd379897c391bd76f2bc519b90ebf0b3f49f2b11389cc143e01eed563fe3c` |
| `action.refresh` | `refresh-cw` | `9b176420920c88de7b1bc3904b54c33b4f2e5c71a44ebca0f03861fcefc83397` |
| `action.close` | `x` | `f90eb6b04596e70b2f3752684be5ec2b75a871dd4cf45a8eee792aad7263a612` |
| `action.more` | `ellipsis` | `918bc1045886f9ac4070b5fca49eff5a33d69c5a86854bcd9fbf14a795d9c511` |
| `action.copy` | `copy` | `b83fdea5841bd0c800cf6977ea248b812fa15b3d61ecca935f9e85f359789646` |
| `action.download` | `download` | `de2b9cb905656d6f27b131b3514b7bac4b513c9e8bf85d4b3277132f1bc321f7` |
| `action.upload` | `upload` | `842eb41f3c43231f16ff37295ebf15bfed5c2419978767aba63cc5dd690b7271` |
| `action.share` | `share-2` | `c820977d9df79d304379a61cf15b5b149b16e0dc096681b019454e70fda64787` |
| `action.reply` | `reply` | `40be184247842cc46b1637ca042ac562d29aa1ae4381d0184c8ec15c6b86ca9d` |
| `action.archive` | `archive` | `d7e333c7bf7ef2fcc99bad1f0fbe60a38064c02d2f08a3d19f0a27c2f3123939` |
| `action.restore` | `archive-restore` | `9ee4cdc5033a7b50a7e5bb5709ce13510a7d1f8c3a9a32973b4d5a89f1bcd759` |
| `action.pin` | `pin` | `e808dc9ff0925654149d034d5b51ccbb4c915510a014e969db41d2c8ad50d4ed` |
| `action.report` | `flag` | `c73ca68240ea29106b4694748e01de503516bbd91c15bcfaf49243dc54a8f662` |
| `action.block` | `ban` | `ccb7543486de959c1e9490932f36e3891c4ce84e8575afefd7fff90cac5966be` |
| `action.follow` | `user-plus` | `50166f2032718c6a9207eeceff53b221cb40172a217bbb0bbb7280b7ac68e201` |
| `action.unfollow` | `user-minus` | `48acf1487228dca6a86b33af506aa552813b4aae4bf8752db2d756a5b73b6326` |
| `action.bookmark` | `bookmark` | `0cb65566a3db0a7166a3519d944d24d7961343ef0ac63abd63713c1d51ad8e9e` |
| `action.like` | `heart` | `0ab65b58eba253f9e7f2eb6dafcd78ffa91277b45b69ba92f78cce209b473f07` |
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
| `action.devices` | `monitor-smartphone` | `1eedc1648a01bc1cb0e6f199ed87b3ea8d4b5b5407186d506ce1c7a828133a35` |
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
| `status.users` | `users` | `289a132782c5ecafb922769988fa9a7ffbd33cf462a447947958aff3a09ff030` |
| `status.file` | `file-text` | `c85e9abe570c3e5bebb0b84534939d02bf6bfe84c9e6ea2d09302e190fc2a879` |
| `status.gallery` | `images` | `34ab979c08108dd367cb19acbbe5253dff91be3aab0f98273aabdaa32ef4c69b` |
| `status.tag` | `tag` | `6a53dac24e6728449f34b57bfce6315b8c1af8fcc6c2f96af3eb77768693f175` |
| `status.mail` | `mail` | `0f27fce80ec46729ce96311d8fc8a37b6619d4bc930714e842f85a72aba26a00` |
| `status.key` | `key-round` | `fb37758a4a3c23dc2de7c998170b072a99d165156cdbe2354622a68250044e7a` |
| `status.shield` | `shield` | `b919c8d139891d8d824784995f048cb46d9d081b83e7b2c08cdb98c9250887fa` |
| `status.help` | `circle-help` | `2e7f6bfc466b72e0714423f80e42af5d80fd38a4833c84837338d0f855512715` |
| `status.unavailable` | `circle-x` | `348f7dba6b9469b38c9fbc165a4ba0a7c854496f0113dccabdd85e9e1538b708` |
