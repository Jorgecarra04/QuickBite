/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: QuickBite_db
-- ------------------------------------------------------
-- Server version	11.5.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES
(1,'Pizzas','Deliciosas pizzas artesanales con masa fresca'),
(2,'Hamburguesas','Hamburguesas gourmet y clásicas 100% carne'),
(3,'Sushi','Sushi fresco y rolls japoneses auténticos'),
(4,'Tacos','Tacos mexicanos con ingredientes tradicionales'),
(5,'Pasta','Pasta italiana fresca hecha al momento'),
(6,'Ensaladas','Ensaladas frescas y saludables'),
(7,'Postres','Dulces y postres caseros deliciosos'),
(8,'Bebidas','Bebidas frías, calientes y refrescos'),
(9,'Bocadillos','Bocadillos y sándwiches variados'),
(10,'Kebabs','Kebabs y comida turca tradicional'),
(11,'Paella','Paellas y arroces valencianos'),
(12,'Asiática','Comida asiática variada y exótica'),
(13,'Mexicana','Auténtica comida mexicana picante'),
(14,'Italiana','Cocina italiana tradicional'),
(15,'Americana','Fast food estilo americano'),
(16,'Vegetariana','Opciones 100% vegetarianas'),
(17,'Vegana','Platos veganos saludables'),
(18,'Pollo','Platos elaborados con pollo'),
(19,'Carne','Carnes rojas a la parrilla'),
(20,'Pescado','Pescados y mariscos frescos');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  `telefono` varchar(9) DEFAULT NULL,
  `direccion` varchar(300) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(5) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `idx_ciudad` (`ciudad`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES
(1,2,'673558539','Avenida Castellana 81','Sevilla','34881','Barcelona','España'),
(2,3,'667373983','Calle Mayor 125','Madrid','20877','Madrid','España'),
(3,4,'671141427','Calle Mayor 164','Zaragoza','51682','Barcelona','España'),
(4,5,'647878363','Calle Gran Vía 166','Madrid','95523','Valencia','España'),
(5,6,'664012195','Calle Goya 171','Sevilla','77723','Sevilla','España'),
(6,7,'668079970','Calle Fuencarral 98','Sevilla','53511','Madrid','España'),
(7,8,'680618008','Calle Atocha 112','Valencia','56989','Barcelona','España'),
(8,9,'691597590','Calle Princesa 106','Sevilla','87095','Barcelona','España'),
(9,10,'657796242','Calle Bravo Murillo 77','Zaragoza','50987','Valencia','España'),
(10,11,'630325998','Calle Goya 39','Barcelona','65846','Barcelona','España'),
(11,12,'615339969','Avenida Castellana 109','Barcelona','79968','Madrid','España'),
(12,13,'689811563','Calle Mayor 171','Barcelona','29035','Zaragoza','España'),
(13,14,'641360009','Calle Atocha 144','Barcelona','53614','Valencia','España'),
(14,15,'678007919','Calle Serrano 200','Sevilla','20705','Sevilla','España'),
(15,16,'636822916','Calle Alcalá 119','Madrid','61055','Sevilla','España'),
(16,17,'650473045','Calle Mayor 88','Madrid','35969','Madrid','España'),
(17,18,'658057658','Calle Serrano 110','Valencia','65440','Sevilla','España'),
(18,19,'679065309','Calle Princesa 8','Madrid','80734','Barcelona','España'),
(19,20,'664435066','Calle Fuencarral 84','Valencia','55538','Zaragoza','España'),
(20,21,'686336929','Calle Princesa 113','Zaragoza','13472','Barcelona','España'),
(21,22,'671006306','Calle Mayor 107','Sevilla','10378','Zaragoza','España'),
(22,23,'636414927','Calle Fuencarral 108','Madrid','63252','Zaragoza','España'),
(23,24,'645546376','Calle Serrano 36','Valencia','86094','Sevilla','España'),
(24,25,'650839883','Calle Fuencarral 3','Valencia','23504','Valencia','España'),
(25,26,'676608994','Calle Mayor 143','Barcelona','87088','Madrid','España'),
(26,27,'688416964','Calle Gran Vía 170','Zaragoza','30590','Barcelona','España'),
(27,28,'676118280','Calle Fuencarral 180','Madrid','52579','Barcelona','España'),
(28,29,'690658529','Calle Princesa 154','Sevilla','60655','Valencia','España'),
(29,30,'678816476','Calle Mayor 93','Barcelona','91252','Sevilla','España'),
(30,31,'699304976','Calle Atocha 146','Valencia','91151','Barcelona','España'),
(31,32,'662183368','Avenida Castellana 181','Madrid','91708','Madrid','España'),
(32,33,'622344488','Avenida Castellana 88','Sevilla','13104','Madrid','España'),
(33,34,'676462689','Avenida Castellana 145','Madrid','14041','Madrid','España'),
(34,35,'643113280','Calle Goya 118','Barcelona','84768','Madrid','España'),
(35,36,'655591573','Calle Bravo Murillo 30','Zaragoza','32868','Valencia','España'),
(36,37,'654558939','Avenida Castellana 25','Barcelona','84318','Valencia','España'),
(37,38,'664788184','Calle Atocha 27','Barcelona','16911','Valencia','España'),
(38,39,'632368504','Calle Atocha 7','Zaragoza','41849','Madrid','España'),
(39,40,'649958834','Calle Bravo Murillo 51','Valencia','79225','Barcelona','España'),
(40,41,'642140271','Calle Atocha 173','Zaragoza','25837','Madrid','España'),
(41,42,'662185592','Calle Fuencarral 87','Sevilla','11074','Madrid','España'),
(42,43,'639527273','Calle Serrano 26','Barcelona','49945','Madrid','España'),
(43,44,'636793549','Avenida Castellana 133','Zaragoza','90663','Valencia','España'),
(44,45,'616496735','Calle Atocha 62','Valencia','23313','Valencia','España'),
(45,46,'615802417','Calle Fuencarral 179','Madrid','45780','Zaragoza','España'),
(46,47,'656037168','Calle Atocha 29','Valencia','16635','Zaragoza','España'),
(47,48,'621924065','Calle Gran Vía 171','Madrid','12663','Sevilla','España'),
(48,49,'689041780','Calle Gran Vía 85','Madrid','17204','Madrid','España'),
(49,50,'676510521','Avenida Castellana 65','Barcelona','49686','Barcelona','España'),
(50,51,'654327028','Calle Mayor 78','Zaragoza','96763','Barcelona','España'),
(64,52,'611222333','Calle Prueba 123','Madrid','28001','Madrid','España'),
(65,53,'661212122','fsdfsfs','fdsfsfs','13132','fdsfsfsd','España'),
(72,60,'666666666',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint(20) NOT NULL,
  `producto_id` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pedido` (`pedido_id`),
  KEY `idx_producto` (`producto_id`),
  KEY `idx_detalle_pedido_compuesto` (`pedido_id`,`producto_id`),
  CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES
(75,51,125,3,2.00,6.00),
(76,51,139,3,10.50,31.50),
(77,51,133,1,7.50,7.50),
(78,51,123,3,11.00,33.00),
(79,52,138,1,11.00,11.00),
(80,52,129,2,4.50,9.00),
(81,52,130,1,8.50,8.50),
(82,53,127,2,11.00,22.00),
(83,54,134,3,7.00,21.00),
(84,54,125,3,2.00,6.00),
(85,55,131,1,12.00,12.00),
(86,55,131,2,12.00,24.00),
(87,56,127,3,11.00,33.00),
(88,56,129,2,4.50,9.00),
(89,56,140,1,5.00,5.00),
(90,57,137,2,9.50,19.00),
(91,57,131,1,12.00,12.00),
(92,57,134,3,7.00,21.00),
(93,58,137,3,9.50,28.50),
(94,58,125,3,2.00,6.00),
(95,58,139,3,10.50,31.50),
(96,59,134,3,7.00,21.00),
(97,59,125,1,2.00,2.00),
(98,59,129,2,4.50,9.00),
(99,60,127,2,11.00,22.00),
(100,60,130,2,8.50,17.00),
(101,61,134,2,7.00,14.00),
(102,61,127,3,11.00,33.00),
(103,62,125,1,2.00,2.00),
(104,62,128,2,10.50,21.00),
(105,62,135,2,5.50,11.00),
(106,63,122,1,9.50,9.50),
(107,63,133,3,7.50,22.50),
(108,63,126,2,8.50,17.00),
(109,64,127,2,11.00,22.00),
(110,65,140,3,5.00,15.00),
(111,65,139,2,10.50,21.00),
(112,66,128,1,10.50,10.50),
(113,66,136,2,2.50,5.00),
(114,66,138,1,11.00,11.00),
(115,66,139,1,10.50,10.50),
(116,67,130,1,8.50,8.50),
(117,67,127,1,11.00,11.00),
(118,67,138,3,11.00,33.00),
(119,67,133,1,7.50,7.50),
(120,68,127,2,11.00,22.00),
(121,68,127,1,11.00,11.00),
(122,68,130,1,8.50,8.50),
(123,69,126,1,8.50,8.50),
(124,69,124,1,12.50,12.50),
(125,70,134,3,7.00,21.00),
(126,70,127,2,11.00,22.00),
(127,70,132,3,1.50,4.50),
(128,70,132,1,1.50,1.50),
(129,71,140,3,5.00,15.00),
(130,72,136,1,2.50,2.50),
(131,73,126,3,8.50,25.50),
(132,73,136,3,2.50,7.50),
(133,74,132,3,1.50,4.50),
(134,74,136,1,2.50,2.50),
(135,75,139,3,10.50,31.50),
(136,75,126,3,8.50,25.50),
(137,75,124,3,12.50,37.50),
(138,75,126,1,8.50,8.50),
(139,76,124,2,12.50,25.00),
(140,76,128,1,10.50,10.50),
(141,77,139,2,10.50,21.00),
(142,77,130,1,8.50,8.50),
(143,77,135,1,5.50,5.50),
(144,77,132,2,1.50,3.00),
(145,78,126,2,8.50,17.00),
(146,78,137,1,9.50,9.50),
(147,78,129,1,4.50,4.50),
(148,78,122,3,9.50,28.50),
(149,79,134,1,7.00,7.00),
(150,79,137,3,9.50,28.50),
(151,79,130,2,8.50,17.00),
(152,80,127,2,11.00,22.00),
(153,80,132,2,1.50,3.00),
(154,80,132,3,1.50,4.50),
(155,80,126,1,8.50,8.50),
(156,81,125,1,2.00,2.00),
(177,96,124,3,12.50,37.50);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fecha_pedido` datetime NOT NULL,
  `estado` enum('PENDIENTE','EN_PREPARACION','EN_CAMINO','ENTREGADO','CANCELADO') NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `direccion_entrega` varchar(300) NOT NULL,
  `ciudad_entrega` varchar(100) DEFAULT NULL,
  `codigo_postal_entrega` varchar(10) DEFAULT NULL,
  `provincia_entrega` varchar(100) DEFAULT NULL,
  `pais_entrega` varchar(100) DEFAULT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `repartidor_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cliente` (`cliente_id`),
  KEY `idx_repartidor` (`repartidor_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha` (`fecha_pedido`),
  KEY `idx_pedidos_fecha_estado` (`fecha_pedido`,`estado`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`repartidor_id`) REFERENCES `repartidores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES
(1,'2026-01-21 09:01:58','ENTREGADO',0.00,'Sin cebolla','Calle Gran Vía 45','Madrid','28013','Madrid','España',1,1),
(2,'2026-01-22 09:01:58','ENTREGADO',0.00,NULL,'Avenida Castellana 100','Madrid','28046','Madrid','España',2,2),
(3,'2026-01-23 09:01:58','ENTREGADO',0.00,'Sin wasabi','Calle Serrano 25','Madrid','28001','Madrid','España',3,3),
(4,'2026-01-24 09:01:58','ENTREGADO',0.00,'Extra picante','Plaza Mayor 8','Madrid','28012','Madrid','España',4,4),
(5,'2026-01-25 09:01:58','ENTREGADO',0.00,NULL,'Calle Alcalá 150','Madrid','28009','Madrid','España',5,5),
(6,'2026-01-26 09:01:58','EN_CAMINO',0.00,NULL,'Calle Goya 20','Madrid','28001','Madrid','España',6,6),
(7,'2026-01-27 09:01:58','EN_PREPARACION',0.00,'Sin gluten','Calle Princesa 55','Madrid','28008','Madrid','España',7,7),
(8,'2026-01-28 09:01:58','PENDIENTE',0.00,NULL,'Calle Atocha 30','Madrid','28012','Madrid','España',8,NULL),
(9,'2026-01-28 09:01:58','PENDIENTE',0.00,'Vegetariano','Calle Fuencarral 100','Madrid','28004','Madrid','España',9,NULL),
(10,'2026-01-20 09:01:58','CANCELADO',0.00,NULL,'Calle Bravo Murillo 200','Madrid','28020','Madrid','España',10,NULL),
(11,'2026-01-18 09:01:58','ENTREGADO',0.00,NULL,'Calle Mayor 45','Madrid','28013','Madrid','España',11,8),
(12,'2026-01-19 09:01:58','ENTREGADO',0.00,'Sin picante','Avenida América 12','Madrid','28002','Madrid','España',12,9),
(13,'2026-01-20 09:01:58','ENTREGADO',0.00,NULL,'Calle Orense 34','Madrid','28020','Madrid','España',13,10),
(14,'2026-01-21 09:01:58','ENTREGADO',0.00,'Extra queso','Calle Velázquez 56','Madrid','28001','Madrid','España',14,11),
(15,'2026-01-22 09:01:58','ENTREGADO',0.00,NULL,'Paseo Castellana 78','Madrid','28046','Madrid','España',15,12),
(16,'2026-01-23 09:01:58','ENTREGADO',0.00,'Sin cebolla','Calle Goya 90','Madrid','28009','Madrid','España',16,13),
(17,'2026-01-24 09:01:58','ENTREGADO',0.00,NULL,'Calle Diego de León 23','Madrid','28006','Madrid','España',17,14),
(18,'2026-01-25 09:01:58','EN_CAMINO',0.00,'Vegetariano','Calle Núñez de Balboa 45','Madrid','28001','Madrid','España',18,15),
(19,'2026-01-26 09:01:58','EN_PREPARACION',0.00,NULL,'Calle Príncipe de Vergara 67','Madrid','28006','Madrid','España',19,16),
(20,'2026-01-27 09:01:58','EN_PREPARACION',0.00,'Sin gluten','Calle General Pardiñas 89','Madrid','28006','Madrid','España',20,17),
(21,'2026-01-28 09:01:58','PENDIENTE',0.00,NULL,'Calle Lagasca 12','Madrid','28001','Madrid','España',21,NULL),
(22,'2026-01-28 09:01:58','PENDIENTE',0.00,'Extra salsa','Calle Hermosilla 34','Madrid','28001','Madrid','España',22,NULL),
(23,'2026-01-28 09:01:58','PENDIENTE',0.00,NULL,'Calle Claudio Coello 56','Madrid','28001','Madrid','España',23,NULL),
(24,'2026-01-13 09:01:58','ENTREGADO',0.00,NULL,'Calle Jorge Juan 78','Madrid','28009','Madrid','España',24,1),
(25,'2026-01-14 09:01:58','ENTREGADO',0.00,'Sin tomate','Calle Ayala 90','Madrid','28006','Madrid','España',25,2),
(26,'2026-01-15 09:01:58','ENTREGADO',0.00,NULL,'Calle Torrijos 23','Madrid','28006','Madrid','España',26,3),
(27,'2026-01-16 09:01:58','ENTREGADO',0.00,'Extra carne','Calle Castelló 45','Madrid','28006','Madrid','España',27,4),
(28,'2026-01-17 09:01:58','ENTREGADO',0.00,NULL,'Calle Lista 67','Madrid','28006','Madrid','España',28,5),
(29,'2026-01-18 09:01:58','ENTREGADO',0.00,'Sin lechuga','Calle Padilla 89','Madrid','28006','Madrid','España',29,6),
(30,'2026-01-19 09:01:58','ENTREGADO',0.00,NULL,'Calle Menéndez Pelayo 12','Madrid','28009','Madrid','España',30,7),
(31,'2026-01-20 09:01:58','ENTREGADO',0.00,'Vegano','Calle O Donnell 34','Madrid','28009','Madrid','España',31,8),
(32,'2026-01-21 09:01:58','ENTREGADO',0.00,NULL,'Calle Ibiza 56','Madrid','28009','Madrid','España',32,9),
(33,'2026-01-22 09:01:58','ENTREGADO',0.00,'Extra picante','Calle Doctor Esquerdo 78','Madrid','28007','Madrid','España',33,10),
(34,'2026-01-23 09:01:58','EN_CAMINO',0.00,NULL,'Calle Narváez 90','Madrid','28009','Madrid','España',34,11),
(35,'2026-01-24 09:01:58','EN_PREPARACION',0.00,'Sin cebolla','Calle Alcalde Sainz de Baranda 23','Madrid','28009','Madrid','España',35,12),
(36,'2026-01-25 09:01:58','EN_PREPARACION',0.00,NULL,'Calle Conde de Peñalver 45','Madrid','28006','Madrid','España',36,13),
(37,'2026-01-26 09:01:58','PENDIENTE',0.00,'Extra queso','Calle Alcántara 67','Madrid','28006','Madrid','España',37,NULL),
(38,'2026-01-27 09:01:58','PENDIENTE',0.00,NULL,'Calle López de Hoyos 89','Madrid','28006','Madrid','España',38,NULL),
(39,'2026-01-28 09:01:58','PENDIENTE',0.00,'Sin salsa','Calle General Oráa 12','Madrid','28006','Madrid','España',39,NULL),
(40,'2026-01-28 09:01:58','EN_PREPARACION',0.00,NULL,'Calle Príncipe de Vergara 123','Madrid','28006','Madrid','España',40,NULL),
(41,'2026-01-08 09:01:58','ENTREGADO',0.00,NULL,'Calle Recoletos 34','Madrid','28001','Madrid','España',41,14),
(42,'2026-01-09 09:01:58','ENTREGADO',0.00,'Vegetariano','Calle Prim 56','Madrid','28006','Madrid','España',42,15),
(43,'2026-01-10 09:01:58','ENTREGADO',0.00,NULL,'Calle María de Molina 78','Madrid','28006','Madrid','España',43,16),
(44,'2026-01-11 09:01:58','ENTREGADO',0.00,'Extra bacon','Calle Francisco Silvela 90','Madrid','28028','Madrid','España',44,17),
(45,'2026-01-12 09:01:58','ENTREGADO',0.00,NULL,'Calle Cartagena 23','Madrid','28028','Madrid','España',45,1),
(46,'2026-01-13 09:01:58','ENTREGADO',0.00,'Sin gluten','Calle Ríos Rosas 45','Madrid','28003','Madrid','España',46,2),
(47,'2026-01-14 09:01:58','ENTREGADO',0.00,NULL,'Calle Santa Engracia 67','Madrid','28010','Madrid','España',47,3),
(48,'2026-01-15 09:01:58','ENTREGADO',0.00,'Extra salsa','Calle Luchana 89','Madrid','28010','Madrid','España',48,4),
(49,'2026-01-16 09:01:58','CANCELADO',0.00,NULL,'Calle Alberto Aguilera 12','Madrid','28015','Madrid','España',49,NULL),
(50,'2026-01-17 09:01:58','CANCELADO',0.00,NULL,'Calle Fuencarral 234','Madrid','28004','Madrid','España',50,NULL),
(51,'2026-01-17 10:06:41','PENDIENTE',78.00,NULL,'Calle Princesa 154','Sevilla','60655','Valencia','España',28,NULL),
(52,'2026-01-09 10:06:41','ENTREGADO',28.50,NULL,'Calle Mayor 107','Sevilla','10378','Zaragoza','España',21,28),
(53,'2026-01-20 10:06:41','PENDIENTE',22.00,'Sin cebolla','Calle Princesa 154','Sevilla','60655','Valencia','España',28,NULL),
(54,'2026-01-13 10:06:41','PENDIENTE',27.00,'Sin cebolla','Calle Mayor 164','Zaragoza','51682','Barcelona','España',3,NULL),
(55,'2026-01-01 10:06:41','PENDIENTE',36.00,NULL,'Calle Princesa 8','Madrid','80734','Barcelona','España',18,NULL),
(56,'2026-01-13 10:06:41','EN_PREPARACION',47.00,NULL,'Calle Atocha 112','Valencia','56989','Barcelona','España',7,NULL),
(57,'2026-01-10 10:06:41','EN_CAMINO',52.00,NULL,'Calle Serrano 36','Valencia','86094','Sevilla','España',23,24),
(58,'2026-01-04 10:06:41','EN_PREPARACION',66.00,NULL,'Calle Mayor 143','Barcelona','87088','Madrid','España',25,NULL),
(59,'2026-01-14 10:06:41','CANCELADO',32.00,NULL,'Calle Gran Vía 166','Madrid','95523','Valencia','España',4,NULL),
(60,'2026-01-11 10:06:41','EN_CAMINO',39.00,'Sin cebolla','Calle Serrano 36','Valencia','86094','Sevilla','España',23,26),
(61,'2026-01-15 10:06:41','EN_CAMINO',47.00,'Sin cebolla','Calle Princesa 106','Sevilla','87095','Barcelona','España',8,28),
(62,'2026-01-07 10:06:41','EN_CAMINO',34.00,NULL,'Calle Serrano 26','Barcelona','49945','Madrid','España',42,24),
(63,'2026-01-05 10:06:41','EN_PREPARACION',49.00,NULL,'Calle Fuencarral 108','Madrid','63252','Zaragoza','España',22,NULL),
(64,'2026-01-10 10:06:41','EN_CAMINO',22.00,NULL,'Calle Serrano 26','Barcelona','49945','Madrid','España',42,28),
(65,'2026-01-25 10:06:41','EN_CAMINO',36.00,NULL,'Calle Atocha 7','Zaragoza','41849','Madrid','España',38,26),
(66,'2026-01-27 10:06:41','EN_PREPARACION',37.00,NULL,'Avenida Castellana 25','Barcelona','84318','Valencia','España',36,NULL),
(67,'2026-01-24 10:06:41','CANCELADO',60.00,'Sin cebolla','Calle Atocha 27','Barcelona','16911','Valencia','España',37,NULL),
(68,'2026-01-24 10:06:41','PENDIENTE',41.50,NULL,'Calle Mayor 143','Barcelona','87088','Madrid','España',25,NULL),
(69,'2026-01-27 10:06:41','EN_CAMINO',21.00,NULL,'Calle Fuencarral 3','Valencia','23504','Valencia','España',24,26),
(70,'2026-01-06 10:06:41','EN_PREPARACION',49.00,NULL,'Calle Fuencarral 108','Madrid','63252','Zaragoza','España',22,NULL),
(71,'2026-01-04 10:06:41','CANCELADO',15.00,NULL,'Avenida Castellana 88','Sevilla','13104','Madrid','España',32,NULL),
(72,'2026-01-10 10:06:41','EN_CAMINO',2.50,NULL,'Calle Mayor 164','Zaragoza','51682','Barcelona','España',3,26),
(73,'2026-01-16 10:06:41','PENDIENTE',33.00,'Sin cebolla','Calle Fuencarral 84','Valencia','55538','Zaragoza','España',19,NULL),
(74,'2026-01-23 10:06:41','EN_CAMINO',7.00,'Sin cebolla','Calle Mayor 78','Zaragoza','96763','Barcelona','España',50,27),
(75,'2026-01-08 10:06:41','PENDIENTE',103.00,'Sin cebolla','Calle Fuencarral 108','Madrid','63252','Zaragoza','España',22,NULL),
(76,'2026-01-03 10:06:41','EN_CAMINO',35.50,'Sin cebolla','Calle Goya 39','Barcelona','65846','Barcelona','España',10,27),
(77,'2026-01-27 10:06:41','PENDIENTE',38.00,'Sin cebolla','Calle Atocha 29','Valencia','16635','Zaragoza','España',46,NULL),
(78,'2026-01-05 10:06:41','CANCELADO',59.50,NULL,'Calle Serrano 200','Sevilla','20705','Sevilla','España',14,NULL),
(79,'2025-12-31 10:06:41','CANCELADO',52.50,'Sin cebolla','Calle Fuencarral 108','Madrid','63252','Zaragoza','España',22,NULL),
(80,'2026-01-27 10:06:41','EN_CAMINO',38.00,NULL,'Calle Fuencarral 179','Madrid','45780','Zaragoza','España',45,24),
(81,'2026-01-28 15:51:22','EN_PREPARACION',2.00,NULL,'fsdfsfs','fdsfsfs','13132','fdsfsfsd','España',65,1),
(96,'2026-02-17 11:38:53','PENDIENTE',37.50,'','fsdfsfsd','sdfsfsd','13600','sdfsdfs','España',72,NULL);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  `stock` int(11) NOT NULL DEFAULT 0,
  `restaurante_id` bigint(20) NOT NULL,
  `categoria_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_nombre` (`nombre`),
  KEY `idx_restaurante` (`restaurante_id`),
  KEY `idx_categoria` (`categoria_id`),
  KEY `idx_disponible` (`disponible`),
  KEY `idx_productos_restaurante_disponible` (`restaurante_id`,`disponible`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`restaurante_id`) REFERENCES `restaurantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES
(122,'Pizza Margarita','Tomate, mozzarella y albahaca fresca',9.50,1,101,1,1),
(123,'Pizza Pepperoni','Tomate, mozzarella y pepperoni',11.00,1,98,1,1),
(124,'Pizza Cuatro Quesos','Mozzarella, gorgonzola, parmesano y provolone',12.50,1,86,1,1),
(125,'Coca-Cola 33cl','Bebida refrescante',2.00,1,0,1,8),
(126,'Burger Clásica','180g de carne, lechuga, tomate, cebolla',8.50,1,51,2,2),
(127,'Cheeseburger Doble','360g de carne, doble queso cheddar',11.00,1,89,2,2),
(128,'Bacon Burger','200g de carne, bacon crujiente, queso',10.50,1,29,2,2),
(129,'Nigiri Salmón (2 piezas)','Arroz con salmón fresco',4.50,1,51,3,3),
(130,'California Roll (8 piezas)','Cangrejo, aguacate, pepino',8.50,1,70,3,3),
(131,'Dragon Roll (8 piezas)','Anguila, aguacate, masago',12.00,1,70,3,3),
(132,'Agua Mineral 50cl','Agua mineral natural',1.50,1,0,3,8),
(133,'Tacos al Pastor (3 uds)','Cerdo marinado, piña, cilantro',7.50,1,55,4,4),
(134,'Tacos de Carnitas (3 uds)','Cerdo confitado, cebolla, cilantro',7.00,0,81,4,4),
(135,'Quesadilla de Queso','Tortilla con queso fundido',5.50,1,82,4,4),
(136,'Horchata 50cl','Bebida tradicional mexicana',2.50,1,51,4,8),
(137,'Espagueti Carbonara','Huevo, guanciale, pecorino romano',9.50,1,66,5,5),
(138,'Lasaña Boloñesa','Carne, bechamel, mozzarella',11.00,1,73,5,5),
(139,'Ravioli de Ricotta','Rellenos de queso ricotta y espinacas',10.50,1,39,5,5),
(140,'Tiramisú','Postre italiano clásico',5.00,1,81,5,7);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repartidores`
--

DROP TABLE IF EXISTS `repartidores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `repartidores` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefono` varchar(9) NOT NULL,
  `matricula_vehiculo` varchar(20) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repartidores`
--

LOCK TABLES `repartidores` WRITE;
/*!40000 ALTER TABLE `repartidores` DISABLE KEYS */;
INSERT INTO `repartidores` VALUES
(1,'Miguel','Rodríguez García','miguel.rodriguez@quickbite.com','612345678','1234ABC',0),
(2,'David','López Martínez','david.lopez@quickbite.com','623456789','2345BCD',1),
(3,'Jorge','González Pérez','jorge.gonzalez@quickbite.com','634567890','3456CDE',1),
(4,'Carlos','Sánchez Fernández','carlos.sanchez@quickbite.com','645678901','4567DEF',1),
(5,'Alberto','Díaz Torres','alberto.diaz@quickbite.com','656789012','5678EFG',1),
(6,'Raúl','Álvarez Ruiz','raul.alvarez@quickbite.com','667890123','6789FGH',1),
(7,'Sergio','Romero Castro','sergio.romero@quickbite.com','678901234','7890GHI',1),
(8,'Javier','Navarro Ortiz','javier.navarro@quickbite.com','689012345','8901HIJ',1),
(9,'Manuel','Moreno Gil','manuel.moreno@quickbite.com','690123456','9012IJK',1),
(10,'Antonio','Jiménez Muñoz','antonio.jimenez@quickbite.com','601234567','0123JKL',1),
(11,'Francisco','Vargas Serrano','francisco.vargas@quickbite.com','612345679','1235KLM',1),
(12,'Luis','Guerrero Blanco','luis.guerrero@quickbite.com','623456780','2346LMN',1),
(13,'Pablo','Cortés Molina','pablo.cortes@quickbite.com','634567891','3457MNO',1),
(14,'Ángel','Medina Delgado','angel.medina@quickbite.com','645678902','4568NOP',1),
(15,'Fernando','Márquez Cruz','fernando.marquez@quickbite.com','656789013','5679OPQ',1),
(16,'Alejandro','Ramos Herrera','alejandro.ramos@quickbite.com','667890124','6780PQR',1),
(17,'Daniel','Iglesias Méndez','daniel.iglesias@quickbite.com','678901235','7891QRS',1),
(18,'Adrián','Castillo Campos','adrian.castillo@quickbite.com','689012346','8902RST',1),
(19,'Mario','Rubio Prieto','mario.rubio@quickbite.com','690123457','9013STU',1),
(20,'Víctor','Santos Pascual','victor.santos@quickbite.com','601234568','0124TUV',1),
(21,'Miguel','Martínez Rodríguez','repartidor0@quickbite.com','672014935','5384DUQ',1),
(22,'Alberto','Sánchez Sánchez','repartidor1@quickbite.com','617318451','7907SMB',1),
(23,'David','Sánchez Rodríguez','repartidor2@quickbite.com','605181139','6433LGY',1),
(24,'Alberto','Sánchez López','repartidor3@quickbite.com','632462825','5057SXD',1),
(25,'Carlos','Rodríguez Martínez','repartidor4@quickbite.com','674787360','7039SEW',1),
(26,'Jorge','Sánchez García','repartidor5@quickbite.com','625467840','3155NYT',1),
(27,'Alberto','Martínez García','repartidor6@quickbite.com','680214673','5228ATR',1),
(28,'Miguel','Sánchez Sánchez','repartidor7@quickbite.com','630825404','3756ISS',1),
(29,'Carlos','Sánchez García','repartidor8@quickbite.com','635422026','2919QQN',1),
(30,'Alberto','García Martínez','repartidor9@quickbite.com','627772520','8399BSM',0);
/*!40000 ALTER TABLE `repartidores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurantes`
--

DROP TABLE IF EXISTS `restaurantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurantes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `direccion` varchar(300) NOT NULL,
  `telefono` varchar(9) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `descripcion` varchar(500) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_nombre` (`nombre`),
  UNIQUE KEY `unique_telefono` (`telefono`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurantes`
--

LOCK TABLES `restaurantes` WRITE;
/*!40000 ALTER TABLE `restaurantes` DISABLE KEYS */;
INSERT INTO `restaurantes` VALUES
(1,'🍕 Pizzería Bella Napoli','Calle Gran Vía 123','123456789',1,'Las mejores pizzas artesanales de Madrid','https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80'),
(2,'🍔 Burger Master','Avenida Castellana 456','912345678',1,'Hamburguesas gourmet 100% vacuno','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80'),
(3,'🍣 Sushi Tokyo','Calle Serrano 789','913456789',1,'Auténtico sushi japonés','https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80'),
(4,'🌮 Tacos Locos','Plaza Mayor 12','914567890',1,'Tacos mexicanos tradicionales','https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80'),
(5,'🍝 Pasta Fresca','Calle Alcalá 234','915678901',1,'Pasta artesanal italiana','https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80');
/*!40000 ALTER TABLE `restaurantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES
(1,'admin','admin@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Administrador','Sistema','ADMIN',1,'2026-01-28 09:01:58'),
(2,'user1','user1@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Carlos','García López','USER',1,'2025-12-29 09:01:58'),
(3,'user2','user2@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','María','Rodríguez Pérez','USER',1,'2026-01-03 09:01:58'),
(4,'user3','user3@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Juan','Martínez Sánchez','USER',1,'2026-01-08 09:01:58'),
(5,'user4','user4@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Ana','López Fernández','USER',1,'2026-01-13 09:01:58'),
(6,'user5','user5@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Luis','González Ruiz','USER',1,'2026-01-18 09:01:58'),
(7,'user6','user6@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Laura','Díaz Moreno','USER',1,'2026-01-20 09:01:58'),
(8,'user7','user7@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Pedro','Álvarez Castro','USER',1,'2026-01-21 09:01:58'),
(9,'user8','user8@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Carmen','Romero Ortiz','USER',1,'2026-01-22 09:01:58'),
(10,'user9','user9@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Miguel','Torres Navarro','USER',1,'2026-01-23 09:01:58'),
(11,'user10','user10@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Isabel','Ramírez Gil','USER',1,'2026-01-24 09:01:58'),
(12,'user11','user11@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Javier','Serrano Vega','USER',1,'2026-01-25 09:01:58'),
(13,'user12','user12@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Patricia','Blanco Muñoz','USER',1,'2026-01-26 09:01:58'),
(14,'user13','user13@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Antonio','Molina Soto','USER',1,'2026-01-27 09:01:58'),
(15,'user14','user14@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Marta','Delgado Cruz','USER',1,'2026-01-28 09:01:58'),
(16,'user15','user15@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Francisco','Jiménez Herrera','USER',1,'2026-01-28 09:01:58'),
(17,'user16','user16@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Rosa','Vargas Méndez','USER',1,'2026-01-28 09:01:58'),
(18,'user17','user17@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Roberto','Iglesias Campos','USER',1,'2026-01-28 09:01:58'),
(19,'user18','user18@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Elena','Castillo Prieto','USER',1,'2026-01-28 09:01:58'),
(20,'user19','user19@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Ángel','Rubio Santos','USER',1,'2026-01-28 09:01:58'),
(21,'user20','user20@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Cristina','Núñez Pascual','USER',1,'2026-01-28 09:01:58'),
(22,'user21','user21@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Fernando','Garrido Lozano','USER',1,'2026-01-28 09:01:58'),
(23,'user22','user22@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Beatriz','Guerrero Cano','USER',1,'2026-01-28 09:01:58'),
(24,'user23','user23@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Alberto','Cortés Ramos','USER',1,'2026-01-28 09:01:58'),
(25,'user24','user24@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Silvia','Medina Ibáñez','USER',1,'2026-01-28 09:01:58'),
(26,'user25','user25@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Raúl','Marín Caballero','USER',1,'2026-01-28 09:01:58'),
(27,'user26','user26@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Lucía','Vidal Domínguez','USER',1,'2026-01-28 09:01:58'),
(28,'user27','user27@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Daniel','Santana Aguilar','USER',1,'2026-01-28 09:01:58'),
(29,'user28','user28@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Verónica','Reyes Moya','USER',1,'2026-01-28 09:01:58'),
(30,'user29','user29@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Sergio','Pascual León','USER',1,'2026-01-28 09:01:58'),
(31,'user30','user30@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Mónica','Ferrer Parra','USER',1,'2026-01-28 09:01:58'),
(32,'user31','user31@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Andrés','Cabrera Bravo','USER',1,'2026-01-28 09:01:58'),
(33,'user32','user32@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Natalia','Calvo Montero','USER',1,'2026-01-28 09:01:58'),
(34,'user33','user33@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Víctor','Carrasco Peña','USER',1,'2026-01-28 09:01:58'),
(35,'user34','user34@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Sandra','Mora Benítez','USER',1,'2026-01-28 09:01:58'),
(36,'user35','user35@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Iván','Rojas Carmona','USER',1,'2026-01-28 09:01:58'),
(37,'user36','user36@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Paula','Suárez Duarte','USER',1,'2026-01-28 09:01:58'),
(38,'user37','user37@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Jorge','Velasco Hidalgo','USER',1,'2026-01-28 09:01:58'),
(39,'user38','user38@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Rocío','Ortega Fuentes','USER',1,'2026-01-28 09:01:58'),
(40,'user39','user39@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Adrián','Peña Lorenzo','USER',1,'2026-01-28 09:01:58'),
(41,'user40','user40@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Eva','Salas Gallego','USER',1,'2026-01-28 09:01:58'),
(42,'user41','user41@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Oscar','Durán Esteban','USER',1,'2026-01-28 09:01:58'),
(43,'user42','user42@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Pilar','Mendoza Román','USER',1,'2026-01-28 09:01:58'),
(44,'user43','user43@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Ricardo','Herrero Varela','USER',1,'2026-01-28 09:01:58'),
(45,'user44','user44@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Alicia','Navarro Robles','USER',1,'2026-01-28 09:01:58'),
(46,'user45','user45@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Diego','Rivas Santana','USER',1,'2026-01-28 09:01:58'),
(47,'user46','user46@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Teresa','León Arias','USER',1,'2026-01-28 09:01:58'),
(48,'user47','user47@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Marcos','Flores Mendez','USER',1,'2026-01-28 09:01:58'),
(49,'user48','user48@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Gloria','Acosta Vera','USER',1,'2026-01-28 09:01:58'),
(50,'user49','user49@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Rubén','Nieto Crespo','USER',1,'2026-01-28 09:01:58'),
(51,'user50','user50@quickbite.com','$2a$10$ZLhnHxdpHETcxmtEStgpI.Jx8K8hzXk7LGFqsLm2fBNYJJkTIQFz6','Irene','Luna Villanueva','USER',1,'2026-01-28 09:01:58'),
(52,'user','user@quickbite.com','$2a$10$UdwlPUOVa0rPfIE0X6xrd.wf8QdlD2dBE.XajerauRiVKDCmbqNFe','Usuario','Prueba','USER',1,'2026-01-28 10:06:41'),
(53,'jcarra_','jorgecarra04@gmail.com','$2a$10$0ISELEEA7kz5xDMG5cmgOuO0WJNkf2xIkUnbgYkOe1KWA8lssFBOS','Jorge','Carramolino Vela','ADMIN',1,'2026-01-28 10:08:21'),
(54,'hola123','jorgec@gmail.com','$2a$10$RDu2gCyxlGEEW66ZesbD7uxlW64b9wOvL/rVMEk.6tYJ/2qa3KPTG','dsfsdf','sdfs','USER',1,'2026-02-02 12:01:10'),
(55,'hola324','sfsdfsf@gmail.com','$2a$10$C8kMpbS/8//u2oYaSr73c.Abmi1ezufOTgk3j3y5hDzJwirJQnJoW','sdfsf','dsfsf','USER',1,'2026-02-02 21:17:50'),
(56,'4234242','sdadadasda@gmail.com','$2a$10$Pq/l486Ozr.vRblQm14MxezuVT2GSy1DOrajR16dTJ70cvzVqmnbC','sdad','asdad','USER',1,'2026-02-03 20:04:02'),
(57,'dsfsfsdf','sdfsdf@gmail.com','$2a$10$SpjCtC3qN4JII41XOMPXXOZXYkdbdtsd0H7PEa00FLoc6QVX4HfWC','sdad','asdad','USER',1,'2026-02-03 20:15:44'),
(58,'afdsfs','sdfsdfds@gmail.com','$2a$10$azquBZRGPOt75coNrI2tEuEynKOVi91135aHXAeypiuujGJ3Ks0r.','sdad','asdad','USER',1,'2026-02-03 20:37:58'),
(59,'hola456','fdsfsf@gmail.com','$2a$10$/3uff69p06GHdqqQJad0Hu2IatvNcAdKnZvsnTuBY4L4VSq1qgfBy','gdf','gfd','USER',1,'2026-02-09 14:09:35'),
(60,'hola777','hola777@gmail.com','$2a$10$EV3K4UmgMcckq/0NLsGdv.RvgDipRRZg6cyPJW6cbdZl6JYpYjpTy','dasdas','sada','USER',1,'2026-02-17 11:38:37');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'QuickBite_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-02-18 15:42:58
