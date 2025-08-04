-- MySQL init script for dragons_den
-- This script creates tables for constants, achievements, treasures, upgrades, and upgrade_definitions

CREATE DATABASE IF NOT EXISTS dragons_den;
USE dragons_den;

-- Table for game constants (key-value)
CREATE TABLE IF NOT EXISTS game_constants (
  `key` VARCHAR(64) PRIMARY KEY,
  `value` TEXT NOT NULL
);

-- Table for achievements
CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description TEXT NOT NULL
);

-- Table for treasures
CREATE TABLE IF NOT EXISTS treasures (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  rarity VARCHAR(32) NOT NULL,
  description TEXT NOT NULL,
  effect TEXT NOT NULL
);

-- Table for upgrades
CREATE TABLE IF NOT EXISTS upgrades (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  baseCost INT NOT NULL,
  effect TEXT NOT NULL,
  maxLevel INT NOT NULL
);

-- Table for upgrade definitions
CREATE TABLE IF NOT EXISTS upgrade_definitions (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  baseEffect TEXT NOT NULL
);

-- Table for player state (single player for now, supports huge numbers)
CREATE TABLE IF NOT EXISTS player_state (
  id INT PRIMARY KEY DEFAULT 1,
  gold_value VARCHAR(32) NOT NULL DEFAULT '0',      -- significand, e.g. '1.23'
  gold_exp INT NOT NULL DEFAULT 0,                 -- exponent, e.g. 1000
  goblins_value VARCHAR(32) NOT NULL DEFAULT '0',
  goblins_exp INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for unlocked achievements (single player)
CREATE TABLE IF NOT EXISTS player_achievements (
  achievement_id VARCHAR(64) PRIMARY KEY,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- Table for collected treasures/relics (single player)
CREATE TABLE IF NOT EXISTS player_treasures (
  treasure_id VARCHAR(64) PRIMARY KEY,
  collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (treasure_id) REFERENCES treasures(id) ON DELETE CASCADE
);
