-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Mar 07 Mars 2017 à 11:37
-- Version du serveur :  5.6.33
-- Version de PHP :  7.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `myexp_api`
--

-- --------------------------------------------------------

--
-- Structure de la table `auth_tokens`
--

CREATE TABLE `auth_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `value` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `competences`
--

CREATE TABLE `competences` (
  `id` int(11) NOT NULL,
  `id_metier` int(11) DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `competences`
--

INSERT INTO `competences` (`id`, `id_metier`, `titre`, `type`) VALUES
(4, 2, 'Faire cuire du pain', 'savoir'),
(5, 2, 'Preparer de la pate a pain', 'savoir'),
(6, 2, 'Preparer de la pate a chou', 'savoir-faire'),
(7, 2, 'Monter de blancs en neige', 'savoir-faire'),
(8, 3, 'Couper du bois', 'savoir'),
(9, 3, 'Trier le buches', 'savoir'),
(10, 3, 'Utiliser les machines', 'savoir-faire'),
(11, 3, 'Reconnaitre les différents type de bois', 'savoir-faire'),
(12, 4, 'Utiliser le shell', 'savoir'),
(13, 4, 'Utiliser le MVC', 'savoir'),
(14, 4, 'Configurer un serveur', 'savoir-faire'),
(15, 4, 'Mettre en production', 'savoir-faire'),
(16, 5, 'Faire du velo', 'savoir'),
(17, 5, 'Lire un plan', 'savoir'),
(18, 5, 'Livrer un recommandé', 'savoir-faire'),
(19, 5, 'Faire un avis de passage', 'savoir-faire'),
(20, 6, 'Lire un plan', 'savoir'),
(21, 6, 'Définir un itinéraire', 'savoir'),
(22, 6, 'Utiliser un GPS', 'savoir-faire'),
(23, 6, 'Livrer les entreprises', 'savoir-faire');

-- --------------------------------------------------------

--
-- Structure de la table `maitres_de_stage`
--

CREATE TABLE `maitres_de_stage` (
  `id` int(11) NOT NULL,
  `id_utilisateur` int(11) DEFAULT NULL,
  `nom_entreprise` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `maitres_de_stage`
--

INSERT INTO `maitres_de_stage` (`id`, `id_utilisateur`, `nom_entreprise`) VALUES
(1, 32, 'Webacademie'),
(2, 33, 'Epitech'),
(3, 38, 'Boulangerie Paul'),
(4, 39, 'FedEx'),
(5, 40, 'La Poste'),
(6, 41, 'Charpentier de france');

-- --------------------------------------------------------

--
-- Structure de la table `metiers`
--

CREATE TABLE `metiers` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `photo_path` varchar(255) NOT NULL,
  `definition` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `metiers`
--

INSERT INTO `metiers` (`id`, `titre`, `photo_path`, `definition`) VALUES
(2, 'Boulanger', 'photo', 'Le boulanger est un professionnel spécialiste de la fabrication du pain, de ses dérivés, de la viennoiserie. Certains pays restreignent cette appellation aux seuls artisans, selon un cahier des charges défini de manière règlementaire.'),
(3, 'Charpentier', 'photo', 'Ouvrier capable de tracer, tailler et assembler un ouvrage de charpente en bois (charpentier en bois) ou en fer (charpentier en fer).'),
(4, 'Informaticien', 'photo', 'Résultats de recherche\r\nRésultat de recherche d\'images pour "definition Informaticien"\r\nUn informaticien ou une informaticienne est une personne qui exerce un métier dans l\'étude, la conception, la production, la gestion ou la maintenance des systèmes de traitement de l\'information. La définition populaire désigne le technicien ou l\'ingénieur généraliste d\'un système informatique.'),
(5, 'Facteur', 'photo', 'A pied, en vélo ou en camionnette (jaune), le facteur ou la factrice fait sa tournée. Il distribue à domicile lettres, recommandés, cartes, journaux, publicités constituant le courrier des habitants, des entreprises ou des collectivités domiciliés dans sa zone de distribution.'),
(6, 'Livreur', 'photo', 'A la fois chauffeur et manutentionnaire, le livreur est responsable de l’organisation de sa tournée, ainsi que des chargements et des déchargements des marchandises qu’il doit acheminer.');

-- --------------------------------------------------------

--
-- Structure de la table `stages`
--

CREATE TABLE `stages` (
  `id` int(11) NOT NULL,
  `id_metier` int(11) DEFAULT NULL,
  `date_debut` varchar(255) NOT NULL,
  `date_fin` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `stages`
--

INSERT INTO `stages` (`id`, `id_metier`, `date_debut`, `date_fin`) VALUES
(2, 2, '2017-01-01', '2018-03-01');

-- --------------------------------------------------------

--
-- Structure de la table `stages_maitres_de_stage`
--

CREATE TABLE `stages_maitres_de_stage` (
  `id` int(11) NOT NULL,
  `id_stage` int(11) DEFAULT NULL,
  `id_maitre_de_stage` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `stages_maitres_de_stage`
--

INSERT INTO `stages_maitres_de_stage` (`id`, `id_stage`, `id_maitre_de_stage`) VALUES
(1, 2, 3);

-- --------------------------------------------------------

--
-- Structure de la table `stages_stagiaires`
--

CREATE TABLE `stages_stagiaires` (
  `id` int(11) NOT NULL,
  `id_stage` int(11) DEFAULT NULL,
  `id_stagiaire` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `stages_stagiaires`
--

INSERT INTO `stages_stagiaires` (`id`, `id_stage`, `id_stagiaire`) VALUES
(2, 2, 10);

-- --------------------------------------------------------

--
-- Structure de la table `stagiaires`
--

CREATE TABLE `stagiaires` (
  `id` int(11) NOT NULL,
  `id_utilisateur` int(11) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `activation` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `stagiaires`
--

INSERT INTO `stagiaires` (`id`, `id_utilisateur`, `nom`, `prenom`, `activation`) VALUES
(10, 34, 'Doe', 'John', 1),
(11, 35, 'Smith', 'Will', 1),
(12, 36, 'Dupont', 'Jean', 0),
(13, 37, 'Gautier', 'Jean-paul', 0);

-- --------------------------------------------------------

--
-- Structure de la table `stagiaires_competences`
--

CREATE TABLE `stagiaires_competences` (
  `id` int(11) NOT NULL,
  `id_stage` int(11) DEFAULT NULL,
  `id_competence` int(11) DEFAULT NULL,
  `validation_stagiaire` tinyint(1) DEFAULT NULL,
  `note_stagiaire` int(11) NOT NULL,
  `competence_stagiaire` int(11) NOT NULL,
  `validation_maitre_de_stage` tinyint(1) NOT NULL,
  `note_maitre_de_stage` int(11) NOT NULL,
  `competence_maitre_de_stage` int(11) NOT NULL,
  `validation_responsable` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `stagiaires_competences`
--

INSERT INTO `stagiaires_competences` (`id`, `id_stage`, `id_competence`, `validation_stagiaire`, `note_stagiaire`, `competence_stagiaire`, `validation_maitre_de_stage`, `note_maitre_de_stage`, `competence_maitre_de_stage`, `validation_responsable`) VALUES
(9, 2, 4, 0, 0, 0, 0, 0, 0, 0),
(10, 2, 5, 0, 0, 0, 0, 0, 0, 0),
(11, 2, 6, 0, 0, 0, 0, 0, 0, 0),
(12, 2, 7, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `mail`, `password_hash`, `role`) VALUES
(28, 'superadmin@mail.com', '$2y$10$TUWEXutm0.7X/HZBorEHkujE6W/RnKkAY8Ess1vfVf1DQtfnGeP9a', 3),
(29, 'superadmin2@mail.com', '$2y$10$VItH51nIfcX0y46ju2BJ6u8cmKkY8DQ8zSJQFjTzKNliSSggA8Eo.', 3),
(30, 'admin@mail.com', '$2y$10$oE.xC0LmTpTP7rwlJSzhSOX0yFPYGmSaqtELPNvGCaFhPPml0mC7q', 2),
(31, 'admin2@mail.com', '$2y$10$9VNHt04DvVxW3V7x2lTUtOK/xqbiMiSa8r38F/9L/hAJZctcNnF.q', 2),
(32, 'maitredestage@mail.com', '$2y$10$n7yHyaXCMc4tSWPme8S0Ou/AkTkjGjzA6qalVnLTWknxxvkyLGTCS', 1),
(33, 'maitredestage2@mail.com', '$2y$10$ZzZ7FYF6v8QGyAtBYfp4lOeE.IFGrKheLWRjAM3BM0YF95Oxv0v3y', 1),
(34, 'stagiaire@mail.com', '$2y$10$b1VO5w5Yn/MS2ZW6hyqpneIH/KXEGjP2LUvptT/Hqliznu2YHpqla', 0),
(35, 'stagiaire2@mail.com', '$2y$10$s1SMDjIDkJWyp2xrHOs2mu/nwNp7AQGCTGuzVDB0f7Ruk9m3kSgOG', 0),
(36, 'stagiaire3@mail.com', '$2y$10$HGHYHaZw6/K/OXJqX4NSiuDeivyUP1QgZKJlHq7Cw1tgZ/qbbozb6', 0),
(37, 'stagiaire4@mail.com', '$2y$10$2WAiGHglS8D9nEecRBJ98e9EbM4Ykl35jMJ8N6qY7xXAVKPK2h5wS', 0),
(38, 'maitredestage3@mail.com', '$2y$10$4Pje1jc2Ajv6fS8eUCcsFOZKjxmsYA3w94MT3dLS/97dETXL43p1K', 1),
(39, 'maitredestage4@mail.com', '$2y$10$d7.J3Wp9AO/O/EB6de7q7OJOsOMe.HkfeOmrMYYKiYZDejP4YHKXe', 1),
(40, 'maitredestage5@mail.com', '$2y$10$92CrDc27IWwAsQeKAs3v6uyOVcBDyLWJGkgNGoOSzGygAYi9Pe9j.', 1),
(41, 'maitredestage6@mail.com', '$2y$10$ew4scJS1xLdfCaTGsG2JZ.eW9q1cal124bo4ZGzLX04ZV6eX5/0pS', 1);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_8AF9B66CA76ED395` (`user_id`);

--
-- Index pour la table `competences`
--
ALTER TABLE `competences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `competences_fk0` (`id_metier`);

--
-- Index pour la table `maitres_de_stage`
--
ALTER TABLE `maitres_de_stage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `metiers`
--
ALTER TABLE `metiers`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `stages`
--
ALTER TABLE `stages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stages_fk0` (`id_metier`);

--
-- Index pour la table `stages_maitres_de_stage`
--
ALTER TABLE `stages_maitres_de_stage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stages_maitres_de_stage_fk1` (`id_maitre_de_stage`),
  ADD KEY `id_stage` (`id_stage`);

--
-- Index pour la table `stages_stagiaires`
--
ALTER TABLE `stages_stagiaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stages_stagiaires_fk1` (`id_stagiaire`),
  ADD KEY `id_stage` (`id_stage`);

--
-- Index pour la table `stagiaires`
--
ALTER TABLE `stagiaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_utilisateur` (`id_utilisateur`),
  ADD KEY `id_utilisateur_2` (`id_utilisateur`);

--
-- Index pour la table `stagiaires_competences`
--
ALTER TABLE `stagiaires_competences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stagiaires_competences_fk0` (`id_stage`),
  ADD KEY `stagiaires_competences_fk1` (`id_competence`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT pour la table `competences`
--
ALTER TABLE `competences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT pour la table `maitres_de_stage`
--
ALTER TABLE `maitres_de_stage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT pour la table `metiers`
--
ALTER TABLE `metiers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT pour la table `stages`
--
ALTER TABLE `stages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `stages_maitres_de_stage`
--
ALTER TABLE `stages_maitres_de_stage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `stages_stagiaires`
--
ALTER TABLE `stages_stagiaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `stagiaires`
--
ALTER TABLE `stagiaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT pour la table `stagiaires_competences`
--
ALTER TABLE `stagiaires_competences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  ADD CONSTRAINT `auth_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `utilisateurs` (`id`);

--
-- Contraintes pour la table `competences`
--
ALTER TABLE `competences`
  ADD CONSTRAINT `competences_ibfk_1` FOREIGN KEY (`id_metier`) REFERENCES `metiers` (`id`);

--
-- Contraintes pour la table `maitres_de_stage`
--
ALTER TABLE `maitres_de_stage`
  ADD CONSTRAINT `maitres_de_stage_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `stages`
--
ALTER TABLE `stages`
  ADD CONSTRAINT `stages_ibfk_1` FOREIGN KEY (`id_metier`) REFERENCES `metiers` (`id`);

--
-- Contraintes pour la table `stages_maitres_de_stage`
--
ALTER TABLE `stages_maitres_de_stage`
  ADD CONSTRAINT `stages_maitres_de_stage_ibfk_1` FOREIGN KEY (`id_stage`) REFERENCES `stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stages_maitres_de_stage_ibfk_2` FOREIGN KEY (`id_maitre_de_stage`) REFERENCES `maitres_de_stage` (`id`);

--
-- Contraintes pour la table `stages_stagiaires`
--
ALTER TABLE `stages_stagiaires`
  ADD CONSTRAINT `stages_stagiaires_ibfk_1` FOREIGN KEY (`id_stage`) REFERENCES `stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stages_stagiaires_ibfk_2` FOREIGN KEY (`id_stagiaire`) REFERENCES `stagiaires` (`id`);

--
-- Contraintes pour la table `stagiaires`
--
ALTER TABLE `stagiaires`
  ADD CONSTRAINT `stagiaires_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `stagiaires_competences`
--
ALTER TABLE `stagiaires_competences`
  ADD CONSTRAINT `stagiaires_competences_ibfk_1` FOREIGN KEY (`id_stage`) REFERENCES `stages` (`id`),
  ADD CONSTRAINT `stagiaires_competences_ibfk_2` FOREIGN KEY (`id_competence`) REFERENCES `competences` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
