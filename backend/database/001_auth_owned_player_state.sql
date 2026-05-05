-- Make Dragons Den saves owned by WebHatchery/guest auth users.

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS auth_user_id VARCHAR(191) NULL AFTER id;

UPDATE player_state
SET auth_user_id = 'legacy_single_player'
WHERE auth_user_id IS NULL OR auth_user_id = '';

ALTER TABLE player_state
  MODIFY auth_user_id VARCHAR(191) NOT NULL;

ALTER TABLE player_state
  MODIFY id INT AUTO_INCREMENT;

ALTER TABLE player_state
  ADD UNIQUE KEY IF NOT EXISTS uq_player_state_auth_user_id (auth_user_id);

ALTER TABLE player_achievements
  ADD COLUMN IF NOT EXISTS auth_user_id VARCHAR(191) NULL FIRST;

UPDATE player_achievements
SET auth_user_id = 'legacy_single_player'
WHERE auth_user_id IS NULL OR auth_user_id = '';

ALTER TABLE player_achievements
  DROP FOREIGN KEY IF EXISTS player_achievements_ibfk_1;

ALTER TABLE player_achievements
  DROP PRIMARY KEY,
  MODIFY auth_user_id VARCHAR(191) NOT NULL,
  ADD PRIMARY KEY (auth_user_id, achievement_id);

ALTER TABLE player_achievements
  ADD CONSTRAINT player_achievements_ibfk_1
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE;

ALTER TABLE player_treasures
  ADD COLUMN IF NOT EXISTS auth_user_id VARCHAR(191) NULL FIRST;

UPDATE player_treasures
SET auth_user_id = 'legacy_single_player'
WHERE auth_user_id IS NULL OR auth_user_id = '';

ALTER TABLE player_treasures
  DROP FOREIGN KEY IF EXISTS player_treasures_ibfk_1;

ALTER TABLE player_treasures
  DROP PRIMARY KEY,
  MODIFY auth_user_id VARCHAR(191) NOT NULL,
  ADD PRIMARY KEY (auth_user_id, treasure_id);

ALTER TABLE player_treasures
  ADD CONSTRAINT player_treasures_ibfk_1
  FOREIGN KEY (treasure_id) REFERENCES treasures(id) ON DELETE CASCADE;
