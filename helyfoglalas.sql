-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2023. Nov 26. 17:54
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `helyfoglalas`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `allomas`
--

CREATE TABLE `allomas` (
  `azonosito` int(11) NOT NULL COMMENT 'Az állomás azonosítója',
  `nev` varchar(50) NOT NULL COMMENT 'Az állomás neve',
  `varos` varchar(50) NOT NULL COMMENT 'Az állomás városa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Az állomások táblája';

--
-- A tábla adatainak kiíratása `allomas`
--

INSERT INTO `allomas` (`azonosito`, `nev`, `varos`) VALUES
(1, 'Csaegaröcsöge', 'Csaegaröcsöge'),
(2, 'Budakeszi', 'Budakeszi'),
(3, 'KekszBurkad', 'Kekszszity'),
(4, 'Baja', 'Baja'),
(5, 'Kistótfalu  repülőtér', 'Kistótfalu'),
(6, 'Vác', 'Vác'),
(7, 'Kiszombor autóbuszállomás', 'Kiszombor'),
(8, 'Piliscsaba repülőtér', 'Piliscsaba'),
(9, 'Lajosmizse vasútállomás', 'Lajosmizse'),
(10, 'Kóny repülőtér', 'Kóny'),
(11, 'Kóny', 'Kóny'),
(12, 'Sztálingrád', 'Sztálingrád'),
(13, 'Auschwitz', 'Auschwitz'),
(14, 'Destination station', 'Station destination'),
(16, 'Ogulin', 'Ogulin');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `id` varchar(30) NOT NULL COMMENT 'Egy generált azonosító a sessionhöz',
  `nev` varchar(20) NOT NULL COMMENT 'A felhasználó neve',
  `email` varchar(25) NOT NULL COMMENT 'A felhasználó emailje',
  `jelszo` varchar(100) NOT NULL COMMENT 'A felhasználó jelszava(titok)',
  `szerep` varchar(5) NOT NULL COMMENT 'A felhasználó szerepköre'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='A felhasználó táblája';

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`id`, `nev`, `email`, `jelszo`, `szerep`) VALUES
('1698782681496', 'Kekszharcos', 'b.enedek670@gmail.com', '$2b$10$bMifD4sBnAWenCEoyG5.ve8UkpdXqS8CT2gnJYt9GI8Q0YQ5QB8K.', 'admin'),
('1698826169313', 'admin', 'Kek@kek.hu', '$2b$10$KQo1aCmyi5jQVl1g.cuE1ewkIrHmfkDjIbmr/7fR2.wHsuG5XJL2i', 'user'),
('1698827346271', 'C78DGC', 'hehe@hehe.hu', '$2b$10$Q7W1xquSlhXDwwBXNcR9JuKW0F0IJj.0ibkGV5wQ60.kX5n8DzVTy', 'user'),
('1698829212240', 'parakill1', 'peksz@ee.hu', '$2b$10$FhxQwBnBWWhRmRkaln1v5OE6y53ruIoKAYXS9oVMDjkWVwHJBwxa.', 'user'),
('1699450323150', 'csukoler', 'csukoler@kajadzik.lu', '$2b$10$9gSkoELCG7l0ExUKHNtc4O8LjJYcmv/lDeiVei8uRAIgPNmYK6zrG', 'user'),
('1699450484163', 'kapjandzki', 'russ@iastun.eu', '$2b$10$9l.LY7wl7npu.rfE6zE2bu1HhDqlsTJZJquvsAaN9N.1Ih0SYLa0e', 'user'),
('1699450519135', 'apuler', 'Abjadzki@kukule.kk', '$2b$10$dnrkCKGQS/nCLyXh8DaHpuYk3EoqwvdmakD5rtlYDJsHXo7bP.joW', 'user'),
('1699612948738', 'Errtun', 'haku@bakuga.eu', '$2b$10$YloXJtveLLTxdiU3QYXRAO8rrx56HfPYbr7c.JJOrQWnW82quTI62', 'user'),
('1699621225020', 'Csukalejjo', 'abuda@buda.bi', '$2b$10$9zMb2pCUUCDVEFVhbA98o.2/sfnbANqWg1GDsCEla7EDNVDPPjplm', 'user'),
('1700222340735', 'bencsikkk', 'b.enede12321k670@213gmail', '$2b$10$OMA5Y8TIkscsBTJ4VAqFuu2Ir10JweWpAmS3bDItJNOOO/0P0tHKe', 'user'),
('1700389381664', 'N30n88', 'vajszabi@wasabi.gyula', '$2b$10$wD9t40PWv.DCmTlwAi4dceytN/R35WI7kQsZ2FUXHqUIsdOj0G02O', 'user'),
('1700415885953', 'Medi', 'csetemedard@gmail.com', '$2b$10$2cxbKfCFrVCZ0AVlVQZZbOcn7P/QaM7/29vWTZHrBtnvh1LwsWTxO', 'admin'),
('1700478762739', 'kivagyokÉn?', 'ki@vagyok.en', '$2b$10$ZYEynz6eF4R8hO3Hz/zsEO7ZTyN4bj2ce3qXuXhOW.NAUcTr/bMvK', 'user'),
('1700756433977', 'pöppön', 'potton.torpe@gmail.com', '$2b$10$6ztGK2KmVNC7mqKgF3L1..HV4ZNEjrFip3HHToGLTepgsxug0rMSq', 'user'),
('1700757416818', 'tolsokafelhasznalo', 'tul@soka.felhasznalo', '$2b$10$zzj/O1RPNq2QHDueskk4C.YQf6BzXEs0Myx5o10X5mKe39TD7C2q2', 'user');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo_jegyek`
--

CREATE TABLE `felhasznalo_jegyek` (
  `azonosito` int(11) NOT NULL COMMENT 'A jegy azonosítója',
  `jegyazonosito` int(11) NOT NULL COMMENT 'A jegynek az azonosítója',
  `felhasznaloazonosito` varchar(30) NOT NULL COMMENT 'A felhasználó azonosítója',
  `db` int(11) NOT NULL COMMENT 'A jegyek darabszáma'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='A felhasználók jegyeinek a táblája';

--
-- A tábla adatainak kiíratása `felhasznalo_jegyek`
--

INSERT INTO `felhasznalo_jegyek` (`azonosito`, `jegyazonosito`, `felhasznaloazonosito`, `db`) VALUES
(22, 14, '1698782681496', 4),
(25, 17, '1698782681496', 1),
(26, 15, '1698782681496', 1),
(28, 19, '1698782681496', 6),
(29, 18, '1698782681496', 1),
(30, 18, '1700389381664', 1),
(31, 18, '1700389381664', 2),
(32, 19, '1700389381664', 1020),
(33, 14, '1698782681496', 6),
(35, 20, '1700478762739', 2),
(36, 18, '1700478762739', 1),
(37, 14, '1700756433977', 7),
(38, 19, '1700756433977', 3),
(39, 20, '1700756433977', 2),
(41, 24, '1700757416818', 3),
(42, 23, '1700757416818', 20);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jarat`
--

CREATE TABLE `jarat` (
  `azonosito` int(11) NOT NULL COMMENT 'A járat azonosítója',
  `datum` date NOT NULL COMMENT 'A dátum, amely napján a járat közlekedik',
  `idopont` time NOT NULL COMMENT 'Az időpont, amikor a járat indul',
  `tipus` varchar(15) NOT NULL COMMENT 'A járat járművének típusa (bus,train,airplane)',
  `induloallomasazon` int(11) NOT NULL COMMENT 'Az állomás azonosítója, ahonnan indul',
  `celallomasazon` int(11) NOT NULL COMMENT 'Az állomás azonosítója, ahová megy'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `jarat`
--

INSERT INTO `jarat` (`azonosito`, `datum`, `idopont`, `tipus`, `induloallomasazon`, `celallomasazon`) VALUES
(4, '2023-12-14', '07:10:27', 'bus', 1, 1),
(5, '2024-01-01', '10:00:00', 'bus', 1, 1),
(6, '2023-11-15', '04:14:00', 'bus', 2, 2),
(10, '2025-12-01', '23:51:00', 'train', 3, 2),
(36, '2023-12-30', '01:23:00', 'bus', 11, 7),
(40, '2023-12-11', '00:00:00', 'airplane', 12, 13),
(47, '2023-01-01', '00:00:00', 'bus', 4, 4),
(48, '2023-01-01', '00:00:00', 'train', 4, 4),
(49, '2023-12-23', '03:02:00', 'airplane', 5, 10),
(51, '2023-11-30', '03:12:00', 'train', 6, 3),
(52, '2023-12-10', '12:03:00', 'train', 16, 9),
(53, '2023-12-01', '00:22:00', 'airplane', 8, 10);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jegy`
--

CREATE TABLE `jegy` (
  `azonosito` int(11) NOT NULL COMMENT 'A jegy azonosítója',
  `ar` int(11) NOT NULL COMMENT 'A jegy ára',
  `jaratazonosito` int(11) NOT NULL COMMENT 'A járatazonosító amelyre a jegy szól',
  `elerheto_db` int(11) NOT NULL COMMENT 'Az elérhető jegyek száma'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='A jegyek táblája';

--
-- A tábla adatainak kiíratása `jegy`
--

INSERT INTO `jegy` (`azonosito`, `ar`, `jaratazonosito`, `elerheto_db`) VALUES
(5, 10000, 4, 0),
(14, 400, 4, 17),
(15, 600, 10, 65),
(17, 52, 36, 40),
(18, 2000000, 10, 7),
(19, 1, 40, 8971),
(20, 321, 47, 26),
(22, 5000, 49, 20),
(23, 2000, 51, 180),
(24, 1000, 52, 117),
(25, 7000, 53, 31);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `allomas`
--
ALTER TABLE `allomas`
  ADD PRIMARY KEY (`azonosito`);

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nev` (`nev`);

--
-- A tábla indexei `felhasznalo_jegyek`
--
ALTER TABLE `felhasznalo_jegyek`
  ADD PRIMARY KEY (`azonosito`),
  ADD KEY `felhaszns` (`felhasznaloazonosito`),
  ADD KEY `jegyazonosito` (`jegyazonosito`);

--
-- A tábla indexei `jarat`
--
ALTER TABLE `jarat`
  ADD PRIMARY KEY (`azonosito`),
  ADD KEY `celallom` (`celallomasazon`),
  ADD KEY `induloallom` (`induloallomasazon`);

--
-- A tábla indexei `jegy`
--
ALTER TABLE `jegy`
  ADD PRIMARY KEY (`azonosito`),
  ADD KEY `jegy_ibfk_1` (`jaratazonosito`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `allomas`
--
ALTER TABLE `allomas`
  MODIFY `azonosito` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Az állomás azonosítója', AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `felhasznalo_jegyek`
--
ALTER TABLE `felhasznalo_jegyek`
  MODIFY `azonosito` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A jegy azonosítója', AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT a táblához `jarat`
--
ALTER TABLE `jarat`
  MODIFY `azonosito` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A járat azonosítója', AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT a táblához `jegy`
--
ALTER TABLE `jegy`
  MODIFY `azonosito` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A jegy azonosítója', AUTO_INCREMENT=26;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `felhasznalo_jegyek`
--
ALTER TABLE `felhasznalo_jegyek`
  ADD CONSTRAINT `felhaszns` FOREIGN KEY (`felhasznaloazonosito`) REFERENCES `felhasznalo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `jegyes` FOREIGN KEY (`jegyazonosito`) REFERENCES `jegy` (`azonosito`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `jarat`
--
ALTER TABLE `jarat`
  ADD CONSTRAINT `celallom` FOREIGN KEY (`celallomasazon`) REFERENCES `allomas` (`azonosito`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `induloallom` FOREIGN KEY (`induloallomasazon`) REFERENCES `allomas` (`azonosito`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `jegy`
--
ALTER TABLE `jegy`
  ADD CONSTRAINT `jegy_ibfk_1` FOREIGN KEY (`jaratazonosito`) REFERENCES `jarat` (`azonosito`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
