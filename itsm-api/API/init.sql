-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: itsmdb
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Dumping data for table `users_user`
--

LOCK TABLES `users_user` WRITE;
/*!40000 ALTER TABLE `users_user` DISABLE KEYS */;
INSERT INTO `users_user` VALUES (1,'pbkdf2_sha256$600000$abc123...','2025-03-15 10:00:00.000000',0,'Иван','Главный',0,1,'2024-01-10 09:00:00.000000','admin@techprom.ru',1,1),(2,'pbkdf2_sha256$600000$abc123...','2025-03-18 11:30:00.000000',0,'Петр','Руководитель',0,1,'2024-02-15 10:00:00.000000','petr.manager@techprom.ru',1,1),(3,'pbkdf2_sha256$600000$abc123...','2025-03-19 09:15:00.000000',0,'Сергей','Инженер',0,1,'2024-03-20 11:00:00.000000','sergey.eng@techprom.ru',1,1),(4,'pbkdf2_sha256$600000$abc123...','2025-03-17 14:45:00.000000',0,'Анна','Лайн',0,1,'2024-04-01 09:30:00.000000','anna.line@techprom.ru',1,1),(5,'pbkdf2_sha256$600000$abc123...','2025-03-16 16:20:00.000000',0,'Ольга','Бухгалтер',0,1,'2024-05-12 08:45:00.000000','olga@techprom.ru',1,1),(6,'pbkdf2_sha256$600000$abc123...','2025-03-18 12:00:00.000000',0,'Дмитрий','Финансист',0,1,'2024-06-01 14:00:00.000000','dmitry@financegroup.ru',1,2),(7,'pbkdf2_sha256$600000$abc123...','2025-03-19 08:30:00.000000',0,'Максим','Айтишник',0,1,'2024-07-10 10:15:00.000000','maxim@digitalsolutions.ru',1,3),(8,'pbkdf2_sha256$1200000$4ATWRegx3RTEaEgbN86fWF$r3nouShffhsSlqGn4nl3IA7woeFkgqddxAgJyBrtUJU=','2026-04-16 10:02:59.558999',1,'Админ','Админович',1,1,'2026-04-12 11:54:14.000000','adm@adm.com',3,1);
/*!40000 ALTER TABLE `users_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tickets_comment`
--

LOCK TABLES `tickets_comment` WRITE;
/*!40000 ALTER TABLE `tickets_comment` DISABLE KEYS */;
INSERT INTO `tickets_comment` VALUES (1,'Попробуйте перезагрузить компьютер',0,'2025-03-10 10:15:00.000000',4,1,1,'comment'),(2,'Перезагрузка не помогла, ошибка осталась',0,'2025-03-10 11:00:00.000000',5,1,1,'comment'),(3,'Проблема в ключе лицензии. Обновлю на сервере.',1,'2025-03-10 13:00:00.000000',3,1,1,'comment'),(4,'Установка выполнена, проверьте работоспособность',0,'2025-03-13 15:00:00.000000',3,2,1,'comment'),(5,'Всё работает, спасибо!',0,'2025-03-14 08:30:00.000000',5,2,1,'comment'),(6,'Необходимо провести профилирование запросов',1,'2025-03-15 11:00:00.000000',2,3,1,'comment'),(7,'Проверил коммутатор - порт отключен из-за loopdetect',1,'2025-03-19 10:45:00.000000',7,4,2,'comment'),(8,'Тикет отменён',0,'2026-04-15 17:40:34.535678',8,1,1,'comment'),(9,'test creation',0,'2026-04-16 10:03:48.775518',8,1,1,'comment'),(10,'asdd',1,'2026-04-16 10:08:10.033232',8,1,1,'comment'),(11,'asdasdasdasd',0,'2026-04-16 10:08:21.842881',8,1,1,'comment'),(12,'asdasdasdasd',0,'2026-04-16 10:08:25.930730',8,1,1,'comment'),(13,'lsadkjf;\sd',0,'2026-04-16 11:50:58.010402',8,1,1,'comment');
/*!40000 ALTER TABLE `tickets_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tickets_ticket`
--

LOCK TABLES `tickets_ticket` WRITE;
/*!40000 ALTER TABLE `tickets_ticket` DISABLE KEYS */;
INSERT INTO `tickets_ticket` VALUES (1,'INC-001','Не открывается 1С на рабочей станции','При запуске 1С ошибка \"Не найдена лицензия\"','incident','high','cancel','2025-03-10 09:00:00.000000','2025-03-10 15:30:00.000000','2025-03-10 14:00:00.000000','2026-04-15 17:40:34.534732',4,2,NULL,2,1),(2,'RQS-001','Запрос на установку ПО','Установить Adobe Photoshop на рабочий компьютер','request','medium','closed','2025-03-12 11:00:00.000000','2025-03-13 16:00:00.000000','2025-03-13 15:00:00.000000','2025-03-14 09:00:00.000000',3,2,NULL,2,1),(3,'PRB-001','Медленная работа базы данных','Долгое выполнение сложных запросов к БД','problem','critical','in_progress','2025-03-14 08:00:00.000000','2025-03-19 10:00:00.000000',NULL,NULL,3,1,NULL,3,1),(4,'INC-002','Нет доступа в интернет','ПК не получает IP-адрес','incident','critical','new','2025-03-19 09:30:00.000000','2025-03-19 09:30:00.000000',NULL,NULL,NULL,4,NULL,6,2),(5,'RQS-002','Создать почтовый ящик','Для нового сотрудника отдела продаж','request','low','in_progress','2025-03-18 14:00:00.000000','2025-03-19 08:00:00.000000',NULL,NULL,7,NULL,NULL,7,3),(6,'REQ-2026-0001','asdasdasd','','service_request','low','new','2026-04-12 14:03:35.030921','2026-04-12 14:03:35.030934',NULL,NULL,NULL,NULL,NULL,8,1),(7,'REQ-2026-0002','asdasd','asdasd','service_request','high','in_progress','2026-04-14 08:07:38.839644','2026-04-14 08:07:38.839656',NULL,NULL,NULL,NULL,NULL,8,1),(8,'REQ-2026-0003','asdasd','asdasd','service_request','low','new','2026-04-16 09:47:34.946238','2026-04-16 09:47:34.946247',NULL,NULL,NULL,NULL,NULL,8,1);
/*!40000 ALTER TABLE `tickets_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cmdb_configurationitem`
--

LOCK TABLES `cmdb_configurationitem` WRITE;
/*!40000 ALTER TABLE `cmdb_configurationitem` DISABLE KEYS */;
INSERT INTO `cmdb_configurationitem` VALUES (1,'SRV-DB-01','active','SN-SERVER-001','AST-001','1','2024-01-15 12:00:00.000000','2025-03-01 10:00:00.000000',1,NULL,1),(2,'PC-BUH-05','active','SN-PC-005','AST-045','2','2024-06-10 09:00:00.000000','2025-02-20 11:30:00.000000',2,NULL,1),(3,'SW-Office-365','active','LIC-O365-001','AST-LIC-01','3','2024-01-20 14:00:00.000000','2025-03-10 16:00:00.000000',5,NULL,1),(4,'PC-FIN-12','maintenance','SN-PC-012','AST-089','6','2024-08-01 11:00:00.000000','2025-03-15 09:20:00.000000',2,NULL,2),(5,'Router-Core','active','SN-ROUT-01','AST-RO-01','7','2024-03-05 08:00:00.000000','2025-03-18 14:00:00.000000',3,NULL,3);
/*!40000 ALTER TABLE `cmdb_configurationitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cmdb_citype`
--

LOCK TABLES `cmdb_citype` WRITE;
/*!40000 ALTER TABLE `cmdb_citype` DISABLE KEYS */;
INSERT INTO `cmdb_citype` VALUES (1,'Сервер','Физический или виртуальный сервер'),(2,'Рабочая станция','Компьютер сотрудника'),(3,'Сетевое оборудование','Коммутаторы, маршрутизаторы'),(4,'Принтер','МФУ и принтеры'),(5,'Программное обеспечение','ОС, СУБД, офисные пакеты');
/*!40000 ALTER TABLE `cmdb_citype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `core_organization`
--

LOCK TABLES `core_organization` WRITE;
/*!40000 ALTER TABLE `core_organization` DISABLE KEYS */;
INSERT INTO `core_organization` VALUES (1,'ООО \"ТехноПром\"'),(2,'АО \"ФинансГрупп\"'),(3,'ИП \"Цифровые Решения\"');
/*!40000 ALTER TABLE `core_organization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users_role`
--

LOCK TABLES `users_role` WRITE;
/*!40000 ALTER TABLE `users_role` DISABLE KEYS */;
INSERT INTO `users_role` VALUES (1,'user'),(2,'support'),(3,'admin');
/*!40000 ALTER TABLE `users_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-19 16:14:01
