-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: investdb
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('12e3f666-dcfb-4bad-88c3-a50b2320c33b','83b97ea062c18235863fe3fd3c166896a84d829134ecf7bc4a81500ad034f277','2025-06-05 01:26:42.943','20250603182050_create_client_asset_and_portafolio_and_assetholding',NULL,NULL,'2025-06-05 01:26:42.182',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_holdings`
--

DROP TABLE IF EXISTS `asset_holdings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_holdings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `portfolioId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assetId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(20,4) NOT NULL,
  `acquiredAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `asset_holdings_portfolioId_assetId_key` (`portfolioId`,`assetId`),
  KEY `asset_holdings_assetId_fkey` (`assetId`),
  CONSTRAINT `asset_holdings_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `asset_holdings_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `portfolios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_holdings`
--

LOCK TABLES `asset_holdings` WRITE;
/*!40000 ALTER TABLE `asset_holdings` DISABLE KEYS */;
INSERT INTO `asset_holdings` VALUES ('01067d04-923c-4bfe-b409-3898f81f3dc4','02cdcc01-80e8-4778-9d85-e71ea5f3a4f8','74944bb2-c500-4182-83b5-669e119ccabe',50.0000,'2025-06-05 01:46:46.445','2025-06-05 01:46:46.445'),('1271388b-fa04-4a03-b6a2-f917cba5f98b','c2fc77d5-4f35-4cef-8bc5-d29626e6f8c4','43c4f7fd-1fdb-461d-bf40-3f3d0c0ca75c',60.0000,'2025-06-05 01:46:59.536','2025-06-05 01:47:06.035'),('148df600-d7a8-4b4b-8a33-223fd952e495','02cdcc01-80e8-4778-9d85-e71ea5f3a4f8','0c58f7f7-5a29-4d7a-a26d-c3fe21c52650',20.0000,'2025-06-05 01:47:09.746','2025-06-05 01:47:09.746'),('1554cb67-45ed-431b-99b9-e161166b4d0e','9cc76bd6-7db3-4215-92d5-efacee358498','d3d2edcb-b588-4889-be6b-e0ca7d7113a1',15.0000,'2025-06-05 01:47:02.934','2025-06-05 01:47:02.934'),('220bf0d8-7cff-44aa-860b-85e1295a21a5','c2fc77d5-4f35-4cef-8bc5-d29626e6f8c4','0ab93f37-5e5b-4a6f-abb1-2b6ac3798bf8',12.0000,'2025-06-05 01:47:19.758','2025-06-05 01:47:19.758'),('30243810-0b33-46ba-8c4b-771b4737c135','1c94b7f3-f508-4ee9-80c6-cd04ca1c4f70','0ab93f37-5e5b-4a6f-abb1-2b6ac3798bf8',20.0000,'2025-06-05 01:46:52.944','2025-06-05 01:46:56.535'),('357ed25a-b392-43fd-89d1-0de3fd4a965c','e753c5f1-b88c-49e1-9555-7f6ba3cd337f','0c58f7f7-5a29-4d7a-a26d-c3fe21c52650',25.0000,'2025-06-05 01:46:49.479','2025-06-05 01:46:49.479'),('84a8c770-2996-4e64-bd82-628402cc0058','9cc76bd6-7db3-4215-92d5-efacee358498','43c4f7fd-1fdb-461d-bf40-3f3d0c0ca75c',22.0000,'2025-06-05 01:47:23.709','2025-06-05 01:47:23.709'),('98dd4db2-4940-4761-b437-2281ff0fb3cd','e753c5f1-b88c-49e1-9555-7f6ba3cd337f','d3d2edcb-b588-4889-be6b-e0ca7d7113a1',40.0000,'2025-06-05 01:47:13.033','2025-06-05 01:47:13.033'),('a59d3b3f-963a-42bb-89b4-3363a2a3c0ff','1c94b7f3-f508-4ee9-80c6-cd04ca1c4f70','74944bb2-c500-4182-83b5-669e119ccabe',8.0000,'2025-06-05 01:47:16.264','2025-06-05 01:47:16.264');
/*!40000 ALTER TABLE `asset_holdings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currentValue` decimal(30,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `assets_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES ('0ab93f37-5e5b-4a6f-abb1-2b6ac3798bf8','Global Tech Futures',25.78),('0c58f7f7-5a29-4d7a-a26d-c3fe21c52650','Venture Capital Inovador',567.89),('43c4f7fd-1fdb-461d-bf40-3f3d0c0ca75c','Horizonte Crescimento Tech',987.65),('74944bb2-c500-4182-83b5-669e119ccabe','Alfa Investimentos Digitais',137.55),('d2633945-5421-45bc-90fc-1f85eaac4f32','Ankatech BR',230.12),('d3d2edcb-b588-4889-be6b-e0ca7d7113a1','Fundo Inovação BR',123.20);
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES ('11ca26fe-370c-4201-beae-fe965254cf64','Sofia Almeida Silva','sofia.almeida@domain.com','ACTIVE'),('144aea65-9613-4ee6-88ae-f08789d2f258','Pedro Rodrigues','pedro.rodrigues@domain.com','ACTIVE'),('1f6a87de-4a30-4e86-9d2f-9d4ddb472384','Mariana Silva','mariana.silva@domain.com','ACTIVE'),('21f0a793-ffa0-4105-a0a8-2518fcb020e3','Ana Costa','ana.costa@domain.com','ACTIVE'),('374c9c68-e069-4ce7-9595-ff23d70d27d7','João Pereira','joao.pereira@domain.com','ACTIVE'),('b9bd7cc8-3d1f-4e2f-ac3f-3d42da0018bb','Ricardo Lima','sricardolimaa@gmail.com','ACTIVE');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolios`
--

DROP TABLE IF EXISTS `portfolios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolios` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `portfolios_clientId_key` (`clientId`),
  CONSTRAINT `portfolios_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolios`
--

LOCK TABLES `portfolios` WRITE;
/*!40000 ALTER TABLE `portfolios` DISABLE KEYS */;
INSERT INTO `portfolios` VALUES ('9cc76bd6-7db3-4215-92d5-efacee358498','11ca26fe-370c-4201-beae-fe965254cf64'),('e753c5f1-b88c-49e1-9555-7f6ba3cd337f','144aea65-9613-4ee6-88ae-f08789d2f258'),('02cdcc01-80e8-4778-9d85-e71ea5f3a4f8','1f6a87de-4a30-4e86-9d2f-9d4ddb472384'),('c2fc77d5-4f35-4cef-8bc5-d29626e6f8c4','21f0a793-ffa0-4105-a0a8-2518fcb020e3'),('1c94b7f3-f508-4ee9-80c6-cd04ca1c4f70','374c9c68-e069-4ce7-9595-ff23d70d27d7');
/*!40000 ALTER TABLE `portfolios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-06  9:25:03
