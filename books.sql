/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50617
Source Host           : localhost:3306
Source Database       : books

Target Server Type    : MYSQL
Target Server Version : 50617
File Encoding         : 65001

Date: 2016-09-06 19:39:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for author
-- ----------------------------
DROP TABLE IF EXISTS `author`;
CREATE TABLE `author` (
  `Id` int(12) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) DEFAULT NULL,
  `bookIds` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of author
-- ----------------------------

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `Id` int(12) NOT NULL,
  `BookId` int(12) DEFAULT NULL,
  `BookName` varchar(50) DEFAULT NULL,
  `Time` datetime DEFAULT NULL,
  `AuthorId` int(12) DEFAULT NULL,
  `BookType` int(12) DEFAULT NULL,
  `BookTYpeId` int(11) DEFAULT NULL,
  `TxtNum` int(50) DEFAULT NULL,
  `BookStatus` int(1) DEFAULT NULL COMMENT '0 连载 1 完本',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book
-- ----------------------------

-- ----------------------------
-- Table structure for booktype
-- ----------------------------
DROP TABLE IF EXISTS `booktype`;
CREATE TABLE `booktype` (
  `Id` int(12) NOT NULL,
  `BookTypeId` int(12) DEFAULT NULL,
  `BookType` varchar(50) DEFAULT NULL,
  `BookTypeParentID` int(12) DEFAULT NULL COMMENT '0 为顶级',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of booktype
-- ----------------------------

-- ----------------------------
-- Table structure for chapter
-- ----------------------------
DROP TABLE IF EXISTS `chapter`;
CREATE TABLE `chapter` (
  `Id` int(12) NOT NULL,
  `BookId` int(12) DEFAULT NULL,
  `ChapterId` int(12) DEFAULT NULL,
  `ChapterName` varchar(50) DEFAULT NULL,
  `TxtNum` int(12) DEFAULT NULL,
  `ChapterTxt` text,
  `UpdateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of chapter
-- ----------------------------
