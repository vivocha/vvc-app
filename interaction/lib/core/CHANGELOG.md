# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.7.0](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.10...@vivocha/client-interaction-core@7.7.0) (2021-02-15)


### Features

* **client-interaction-core:** expose offerMedia() and isRemote/isLocalVideoConnecting variables ([9abdea8](https://github.com/vivocha/widgets/commit/9abdea8e110728cbc326696f955a54d1e56d420a))





## [7.6.10](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.9...@vivocha/client-interaction-core@7.6.10) (2021-02-01)


### Bug Fixes

* clean ([decd444](https://github.com/vivocha/widgets/commit/decd44401831707cdb25082481306496c1aa8b60))
* improve check on agent request (request_seamless_cobrowsing) ([12b3ce5](https://github.com/vivocha/widgets/commit/12b3ce5478a13ecd2d6e9c4af4a724ae59149c83))
* **core:** ask remote capabilities on context sync/resume ([7e8b9e1](https://github.com/vivocha/widgets/commit/7e8b9e16ee91f7c882d7cadc6296c2130d5c7ec2))
* **core:** fix glitch on sync + persistence ([51d73e4](https://github.com/vivocha/widgets/commit/51d73e44f0a98672508e556c2055177c64058b30))
* **core:** fix minimized glitch on sync ([87e8860](https://github.com/vivocha/widgets/commit/87e8860f3ebe743f5e45d4af79d530965ae3a8e9))
* **core:** fix missing ts on attachment messages ([2f183c1](https://github.com/vivocha/widgets/commit/2f183c17414221956672a7a242ea3a82a78ee414)), closes [#5](https://github.com/vivocha/widgets/issues/5)
* **core:** force angular scope sync to display upload button ([0c868e4](https://github.com/vivocha/widgets/commit/0c868e41af82163ce6ba4f5433292978b7facbb4))
* **core:** handle hidden field editable by agent ([740a3fd](https://github.com/vivocha/widgets/commit/740a3fddb3353f9fdd87d42f62c3e5ed5330e925)), closes [#4](https://github.com/vivocha/widgets/issues/4)
* **core:** improve sendRead check ([636baaf](https://github.com/vivocha/widgets/commit/636baaf8c40e3d2aabcf88162e5b910246a88aa0))
* **core:** set dissuasion timer after resume ([8760b73](https://github.com/vivocha/widgets/commit/8760b731247615c91730b30bba0265de47dd9c7f)), closes [#42](https://github.com/vivocha/widgets/issues/42)





## [7.6.9](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.8...@vivocha/client-interaction-core@7.6.9) (2020-10-20)


### Bug Fixes

* **core:** fullscreen bugfixes ([4f3ca0e](https://github.com/vivocha/widgets/commit/4f3ca0e7fdb1a96fa1bcfef7cef576627eee01c9)), closes [#2](https://github.com/vivocha/widgets/issues/2)
* **core:** handle file upload promise reject ([d9e8840](https://github.com/vivocha/widgets/commit/d9e8840a5d4ee0723d6fab6824c5de0b5e63ccdd))





## [7.6.8](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.7...@vivocha/client-interaction-core@7.6.8) (2020-09-28)


### Bug Fixes

* **lib:** avoid send read resend ([17d3d02](https://github.com/vivocha/widgets/commit/17d3d02fc0868ea87199898a06d9b84665b1df74))





## [7.6.7](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.6...@vivocha/client-interaction-core@7.6.7) (2020-09-23)


### Bug Fixes

* **lib:** ignore agent change from messages without from_id (e.g. read from script) ([5b2fbe3](https://github.com/vivocha/widgets/commit/5b2fbe34b478fcfa82d7ea53b48324dd5d60dd5f))





## [7.6.6](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.5...@vivocha/client-interaction-core@7.6.6) (2020-09-23)


### Bug Fixes

* **lib:** add avatar ([2bd90eb](https://github.com/vivocha/widgets/commit/2bd90ebf6264138e259a353cd16e919882fdf34e))





## [7.6.5](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.4...@vivocha/client-interaction-core@7.6.5) (2020-09-23)


### Bug Fixes

* **lib:** restoree fallback to nick and avatar on agentMsg ([c9e0db4](https://github.com/vivocha/widgets/commit/c9e0db42a5286430495aa4301bd21211d9d21e9f))





## [7.6.4](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.3...@vivocha/client-interaction-core@7.6.4) (2020-09-23)


### Bug Fixes

* **lib:** check for agent change on raw message ([42704bb](https://github.com/vivocha/widgets/commit/42704bbb3180b0ad7b785e587fcdbef1f47f47bb))





## [7.6.3](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.2...@vivocha/client-interaction-core@7.6.3) (2020-09-21)


### Bug Fixes

* **lib:** fix persistence avatar and title from script ([5a3c3de](https://github.com/vivocha/widgets/commit/5a3c3de6dbf0f2baefba4f5612963ece04d16498))





## [7.6.2](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.1...@vivocha/client-interaction-core@7.6.2) (2020-09-03)


### Bug Fixes

* **lib:** check for conversation update or outbound every 10s ([b8bff6a](https://github.com/vivocha/widgets/commit/b8bff6a95713536ca6b9032223a7826f3ecdc4ff))
* **lib:** check for currentContact before creating new on conversation idle state ([6c54f2c](https://github.com/vivocha/widgets/commit/6c54f2c10ad9b21eb9665e93107c721df4bfe050))
* **lib:** disable transfer timeout and message on rerouted contact ([a98a465](https://github.com/vivocha/widgets/commit/a98a4656aae04924b707e8a943f29e5c4c020a81))
* **lib:** manage from_avatar in message ([371e132](https://github.com/vivocha/widgets/commit/371e1326a2697cd7ce2734efdbbe02b190939844))
* **lib:** manage left/clear events generated from a different window ([800cdcd](https://github.com/vivocha/widgets/commit/800cdcd30bd846cb529f98eed6ce83ccef1b508f))
* **lib:** manage no agents from contact creation ([80b8101](https://github.com/vivocha/widgets/commit/80b81016724786f2176d7fbabd92e72e5cd5e527))
* **lib:** retrieve agent info from previous message on resume ([2fa64aa](https://github.com/vivocha/widgets/commit/2fa64aa069d64244bf1d7a79e78d709d5653947a))
* **lib:** show unread badge on conversation idle ([a23ac89](https://github.com/vivocha/widgets/commit/a23ac8934b5bdd0adbce86ea1720acc3c7c3aa17))
* **lib:** show unread badge only with customerToken ([f2a8020](https://github.com/vivocha/widgets/commit/f2a8020b73a715d78cfcc5e05fd5a7a35ce74b08))





## [7.6.1](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.6.0...@vivocha/client-interaction-core@7.6.1) (2020-06-10)


### Bug Fixes

* **core:** fix bug on associating the correct sender of previous contacts ([19c8aa8](https://github.com/vivocha/widgets/commit/19c8aa87fdc365f80c62c4b19291a5ee4bf6b3fe))





# [7.6.0](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.5.8...@vivocha/client-interaction-core@7.6.0) (2020-06-10)


### Bug Fixes

* **conversation:** fix positioning and queue state on conversation ([a607bf9](https://github.com/vivocha/widgets/commit/a607bf9206e1cbbe0d089a3fd7f5b9d7596d9fde))


### Features

* **core:** very basic conversation ([dcf9a8e](https://github.com/vivocha/widgets/commit/dcf9a8ef87bd8e3afc885c877d91caaa6dffe437))





## [7.5.8](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.5.7...@vivocha/client-interaction-core@7.5.8) (2020-05-22)


### Bug Fixes

* **acks:** warning acks now visible only if acks are shown by activating vars ([7c3786a](https://github.com/vivocha/widgets/commit/7c3786ae6b28c192d776d123a0207c9ca78392fe))





## [7.5.7](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.5.6...@vivocha/client-interaction-core@7.5.7) (2020-05-21)


### Bug Fixes

* **inbound:** fix upgrade to chat from inbound ([c95020d](https://github.com/vivocha/widgets/commit/c95020d0835ff49364f6c30638f937653eecf944))





## [7.5.6](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.5.5...@vivocha/client-interaction-core@7.5.6) (2020-05-19)


### Bug Fixes

* **read:** send read ack for templates ([80c2fa6](https://github.com/vivocha/widgets/commit/80c2fa6a29b3b02695ee04c20562ad1f7caf9512))





## [7.5.5](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.5.4...@vivocha/client-interaction-core@7.5.5) (2020-05-18)


### Bug Fixes

* **ack:** fix ack on quick reply ([911dfdc](https://github.com/vivocha/widgets/commit/911dfdc589dd676e53188fa05f19cde52ff923d7))
* **read:** send read for quick reply ([0b59b82](https://github.com/vivocha/widgets/commit/0b59b824d92630f348737a0f98bb70e88edf3dba))





## [7.5.4](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.5.3...@vivocha/client-interaction-core@7.5.4) (2020-05-18)


### Bug Fixes

* **earlychat:** fix error that prevent the send message ([6da17c9](https://github.com/vivocha/widgets/commit/6da17c95229986201bc3d6cdbdf8ce0383d810ee))





## [7.5.3](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.5.2...@vivocha/client-interaction-core@7.5.3) (2020-05-18)


### Bug Fixes

* **acks:** add ack property to message if is not set and read received ([9413e7d](https://github.com/vivocha/widgets/commit/9413e7d3f78d5eddfc4f027029b769685ae01b20))
* **lib:** message sorting fix on welcome messages ([99303d8](https://github.com/vivocha/widgets/commit/99303d834b4694e4e7bcdefe7201f73dd076062f))
* **lib:** remove comment ([e023556](https://github.com/vivocha/widgets/commit/e023556a34a6b29b710aef23a55fe96f991e0182))
* **lib:** welcome message ([e77dbc8](https://github.com/vivocha/widgets/commit/e77dbc8a9672786c1dbdc4abaf28393b36af318b))





## [7.5.2](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.5.1...@vivocha/client-interaction-core@7.5.2) (2020-05-14)


### Bug Fixes

* **acks:** fix acks and read on attachment ([4378931](https://github.com/vivocha/widgets/commit/437893169145dce323d613742ead38d5933ad4f2))
* **lib:** messages sorted by ts ([cc0b994](https://github.com/vivocha/widgets/commit/cc0b994195f8010d87e788440669ed82f4b4b7f9))





## [7.5.1](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.5.0...@vivocha/client-interaction-core@7.5.1) (2020-05-14)


### Bug Fixes

* **lib:** avoid displaying duplicated messages ([82ee966](https://github.com/vivocha/widgets/commit/82ee9664de5c509eff76d6fe54133ed285881b7c))





# [7.5.0](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.4.1...@vivocha/client-interaction-core@7.5.0) (2020-05-14)


### Features

* **inbound:** variable to show international prefix ([bf4ee48](https://github.com/vivocha/widgets/commit/bf4ee485dc4a74d02bb40cb946e6083f27379da2))





## [7.4.1](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.4.0...@vivocha/client-interaction-core@7.4.1) (2020-05-14)


### Bug Fixes

* **core:** detection change on send message and welcome in persistence ([2560dcf](https://github.com/vivocha/widgets/commit/2560dcfac6a7de07fcb24a2189c601f0241ca20a))





# [7.4.0](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.3.0...@vivocha/client-interaction-core@7.4.0) (2020-05-13)


### Bug Fixes

* **lib:** fix interactionStart and hasReceivedMsgs values on resume ([aa17673](https://github.com/vivocha/widgets/commit/aa1767398ce1030b4345459744c571e3520be9d7))


### Features

* **acks:** add acks warnings and resend on failed ([ad03f47](https://github.com/vivocha/widgets/commit/ad03f474e6c95fb4f982988b49d5cdd8c92931f8))





# [7.3.0](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.2.0...@vivocha/client-interaction-core@7.3.0) (2020-05-12)


### Features

* **acks:** variable to show acks and read messages ([9b74dfe](https://github.com/vivocha/widgets/commit/9b74dfed02796b7051058c9d7e7bcb2b002743b8))
* **lib:** tooltips on acks ([a3ab2c7](https://github.com/vivocha/widgets/commit/a3ab2c77a0200a8806de5547f3d86fa1d6bc3872))





# [7.2.0](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.1.4...@vivocha/client-interaction-core@7.2.0) (2020-05-11)


### Bug Fixes

* **lib:** check if sendRead exists for retro compatibility ([3c8ba60](https://github.com/vivocha/widgets/commit/3c8ba602b279dbdd0acf3e119eff4e68383d89fd))


### Features

* **acks:** add ack and read icons ([28f550c](https://github.com/vivocha/widgets/commit/28f550c45b9a6dde54d80c19cd5acb6ec311c874))
* **lib:** initial support for contact continuation after agent left ([21176d2](https://github.com/vivocha/widgets/commit/21176d2af67b853dc61af4fac5f2ca21f03a9615))





## [7.1.4](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.1.3...@vivocha/client-interaction-core@7.1.4) (2020-04-07)


### Bug Fixes

* **interaction.core:** add location.search to strings request ([fe7d485](https://github.com/vivocha/widgets/commit/fe7d48531c92cbf8d5861ab3ca25dbbe6e1fb47d))





## [7.1.3](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.1.2...@vivocha/client-interaction-core@7.1.3) (2020-04-03)


### Bug Fixes

* **cbn:** parsing phone number with language code ([8bf3aee](https://github.com/vivocha/widgets/commit/8bf3aee1ec7a31421242f3fb3caa39c4c67a0aba))





## [7.1.2](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.1.1...@vivocha/client-interaction-core@7.1.2) (2020-04-03)


### Bug Fixes

* **interaction:** show inbound formatted number ([1cbf023](https://github.com/vivocha/widgets/commit/1cbf02336f9c1ef142791aef825625376543b45b))





## [7.1.1](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.1.0...@vivocha/client-interaction-core@7.1.1) (2020-03-31)


### Bug Fixes

* **inbound:** fix inbound state management ([f5f633f](https://github.com/vivocha/widgets/commit/f5f633f3e175e7706077aada44ceb22d1e5365d4))





# [7.1.0](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.9...@vivocha/client-interaction-core@7.1.0) (2020-03-30)


### Features

* **inbound:** first working version of number allocation ([aab1af6](https://github.com/vivocha/widgets/commit/aab1af6b7d3878813382ed9bca1fc9623f9807a0))





## [7.0.9](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.8...@vivocha/client-interaction-core@7.0.9) (2020-03-16)


### Bug Fixes

* **lib:** checkbox visibility ([abf01db](https://github.com/vivocha/widgets/commit/abf01db8c2fb39c18f76b0ad566b17cf1b4766e4))





## [7.0.8](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.7...@vivocha/client-interaction-core@7.0.8) (2020-03-13)


### Bug Fixes

* **lib:** fix boolean on checkbox and hide message ([105a1db](https://github.com/vivocha/widgets/commit/105a1dbb93e9549cced3a6ecc05a8468e0a1e591))





## [7.0.7](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.6...@vivocha/client-interaction-core@7.0.7) (2020-03-12)

**Note:** Version bump only for package @vivocha/client-interaction-core





## [7.0.6](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.5...@vivocha/client-interaction-core@7.0.6) (2020-01-28)


### Bug Fixes

* **interaction.app:** init app inside a custom selector ([8c6519e](https://github.com/vivocha/widgets/commit/8c6519ea0d7df0d095b5d3b8ecbf26656285cbd1))
* **interaction.core:** fix remember position after app drag ([23cc9f1](https://github.com/vivocha/widgets/commit/23cc9f1ef95dd1f18a208730c53985f0e2f02d33))
* **interaction.core:** handle context.canMinimize ([c495f6a](https://github.com/vivocha/widgets/commit/c495f6a61e3f9b9ed252623334ed037e2096c091))





## [7.0.5](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.4...@vivocha/client-interaction-core@7.0.5) (2019-12-19)


### Bug Fixes

* **interaction.core:** fix createTranslateLoader regexp ([12f2b39](https://github.com/vivocha/widgets/commit/12f2b39421ef62c1e4557752353a2f1bc6bada7e))





## [7.0.4](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.3...@vivocha/client-interaction-core@7.0.4) (2019-11-18)

**Note:** Version bump only for package @vivocha/client-interaction-core





## [7.0.3](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.2...@vivocha/client-interaction-core@7.0.3) (2019-11-18)

**Note:** Version bump only for package @vivocha/client-interaction-core





## [7.0.2](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.1...@vivocha/client-interaction-core@7.0.2) (2019-11-18)

**Note:** Version bump only for package @vivocha/client-interaction-core





## [7.0.1](https://github.com/vivocha/widgets/compare/@vivocha/client-interaction-core@7.0.0...@vivocha/client-interaction-core@7.0.1) (2019-11-15)


### Bug Fixes

* **interaction.core:** update deps ([57a4578](https://github.com/vivocha/widgets/commit/57a45785a96c1d2a1b93c22e5b9b1a0a07363811))
* **interaction.core:** update to angular 8 ([31b928a](https://github.com/vivocha/widgets/commit/31b928ab8c53b4809123302ac5040a3fdb1af156))
