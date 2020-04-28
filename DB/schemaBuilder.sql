-- MySQL dump 10.13  Distrib 5.7.20, for Win64 (x86_64)
--
-- Host: localhost    Database: examiner
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_tracker`
--

DROP TABLE IF EXISTS `activity_tracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_tracker` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `activity_type_id` bigint(20) NOT NULL,
  `activity_target_id` bigint(20) DEFAULT NULL,
  `activity_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_type_id` (`activity_type_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activity_tracker_ibfk_1` FOREIGN KEY (`activity_type_id`) REFERENCES `activity_type` (`id`),
  CONSTRAINT `activity_tracker_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `activity_type`
--

DROP TABLE IF EXISTS `activity_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `activity` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `answer_text` text CHARACTER SET utf8,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18664 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `answer_sheet`
--

DROP TABLE IF EXISTS `answer_sheet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer_sheet` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) DEFAULT NULL,
  `question_id` bigint(20) DEFAULT NULL,
  `answer_id` bigint(20) DEFAULT NULL,
  `is_for_review` tinyint(1) DEFAULT NULL,
  `is_question_answered` tinyint(1) DEFAULT NULL,
  `is_for_report_issue` tinyint(1) DEFAULT NULL,
  `issue_reported` text,
  `answer_subjective` text,
  `answered_datetime` datetime DEFAULT NULL,
  `total_time_elapsed_minute` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `question_id` (`question_id`),
  KEY `answer_id` (`answer_id`),
  CONSTRAINT `answer_sheet_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `answer_sheet_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`),
  CONSTRAINT `answer_sheet_ibfk_3` FOREIGN KEY (`answer_id`) REFERENCES `answer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `batch`
--

DROP TABLE IF EXISTS `batch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `batch` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `batch_name` varchar(500) NOT NULL,
  `batch_start_date` datetime DEFAULT NULL,
  `batch_end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_status`
--

DROP TABLE IF EXISTS `exam_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exam_status` (
  `id` bigint(20) NOT NULL,
  `status_name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `login_history`
--

DROP TABLE IF EXISTS `login_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) DEFAULT NULL,
  `login_date_time` datetime NOT NULL,
  `is_success` tinyint(1) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `login_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `question_type_id` bigint(20) DEFAULT NULL,
  `question_category_id` bigint(20) DEFAULT NULL,
  `question_para1` text,
  `question_para2` text,
  `answer_ids` text,
  `right_answer_ids` text,
  `answer_text` text,
  PRIMARY KEY (`id`),
  KEY `question_type_id` (`question_type_id`),
  KEY `question_category_id` (`question_category_id`),
  CONSTRAINT `question_ibfk_3` FOREIGN KEY (`question_type_id`) REFERENCES `question_types` (`id`),
  CONSTRAINT `question_ibfk_4` FOREIGN KEY (`question_category_id`) REFERENCES `question_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2432 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_category`
--

DROP TABLE IF EXISTS `question_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_paper`
--

DROP TABLE IF EXISTS `question_paper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_paper` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `paper_title` varchar(300) DEFAULT NULL,
  `course_name` varchar(200) DEFAULT NULL,
  `instructions` longtext,
  `total_time_in_secs` int(11) DEFAULT NULL,
  `author_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_paper_question_mapping`
--

DROP TABLE IF EXISTS `question_paper_question_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_paper_question_mapping` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `question_paper_id` bigint(20) NOT NULL,
  `question_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `question_paper_id` (`question_paper_id`),
  CONSTRAINT `question_paper_question_mapping_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`),
  CONSTRAINT `question_paper_question_mapping_ibfk_3` FOREIGN KEY (`question_paper_id`) REFERENCES `question_paper` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=421 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_types`
--

DROP TABLE IF EXISTS `question_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `question_type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `batch_id` bigint(20) DEFAULT NULL,
  `registration_start_date` datetime DEFAULT NULL,
  `registration_end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `batch_id` (`batch_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `student_ibfk_4` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`id`),
  CONSTRAINT `student_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_exam_history`
--

DROP TABLE IF EXISTS `student_exam_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_exam_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) DEFAULT NULL,
  `question_paper_id` bigint(20) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `exam_status_id` bigint(20) DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `time_left_in_secs` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_status_id` (`exam_status_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `student_exam_history_ibfk_1` FOREIGN KEY (`exam_status_id`) REFERENCES `exam_status` (`id`),
  CONSTRAINT `student_exam_history_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_exam_mapping`
--

DROP TABLE IF EXISTS `student_exam_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_exam_mapping` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `batch_id` bigint(20) DEFAULT NULL,
  `student_id` bigint(20) DEFAULT NULL,
  `question_paper_id` bigint(20) NOT NULL,
  `available_from` datetime DEFAULT NULL,
  `available_till` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `question_paper_id` (`question_paper_id`),
  KEY `batch_id` (`batch_id`),
  CONSTRAINT `student_exam_mapping_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `student_exam_mapping_ibfk_2` FOREIGN KEY (`question_paper_id`) REFERENCES `question_paper` (`id`),
  CONSTRAINT `student_exam_mapping_ibfk_3` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teacher` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `isPaperSetter` tinyint(1) DEFAULT NULL,
  `isExamScheduler` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(10) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `registration_date` datetime DEFAULT NULL,
  `registration_validity` datetime DEFAULT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`username`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'examiner'
--

--
-- Dumping routines for database 'examiner'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-12  1:12:58
