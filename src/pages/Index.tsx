
import React from 'react';
import TreeBrowser from '../components/TreeBrowser';

// Sample data
const sampleData = [
  {
    "path": ["Fakultät für Biologie", "Tutorenbörse Biologie"],
    "course": {
      "number": "",
      "name": "Tutorinnen und Tutoren gesucht für Übung Organismische Biologie",
      "type": "n/a",
      "url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=wtree&search=1&trex=step&root120251=756615%7C746033%7C746892&P.vx=kurz",
      "detail_url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=1071859&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung",
      "professor": "Klingl"
    }
  },
  {
    "path": [
      "Fakultät für Geowissenschaften",
      "Geographie",
      "Master Umweltsysteme und Nachhaltigkeit - Monitoring, Modellierung und Management",
      "2. Semester",
      "Exkursionen"
    ],
    "course": {
      "number": "20208",
      "name": "Große Exkursion (M.Sc.) (physisch): Costa Rica",
      "type": "Exkursion",
      "url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=wtree&search=1&trex=step&root120251=756615%7C757727%7C758749%7C760860%7C762255%7C754666&P.vx=kurz",
      "detail_url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=1069251&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung",
      "professor": "Ludwig",
      "description": "This course includes a field trip to Costa Rica to study tropical ecosystems and sustainability practices.",
      "semester": "SoSe 2025",
      "language": "Deutsch/Englisch"
    }
  },
  {
    "path": [
      "Fakultät für Geowissenschaften",
      "Geographie",
      "Master Umweltsysteme und Nachhaltigkeit - Monitoring, Modellierung und Management",
      "2. Semester",
      "Übungen"
    ],
    "course": {
      "number": "20207",
      "name": "Ü (M.Sc.) Stoff- und Energieflüsse im System Boden-Pflanze-Atmosphäre",
      "type": "Übung",
      "url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=wtree&search=1&trex=step&root120251=756615%7C757727%7C758749%7C760860%7C762255%7C749353&P.vx=kurz",
      "detail_url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=1070412&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung",
      "professor": "Gampe"
    }
  },
  {
    "path": [
      "Fakultät für Geowissenschaften",
      "Geographie",
      "Master Umweltsysteme und Nachhaltigkeit - Monitoring, Modellierung und Management",
      "2. Semester",
      "Seminare"
    ],
    "course": {
      "number": "20205",
      "name": "S (MSc.) Vorbereitungsseminar Große Exkursion Master Umweltsysteme",
      "type": "Seminar",
      "url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=wtree&search=1&trex=step&root120251=756615%7C757727%7C758749%7C760860%7C762255%7C748842&P.vx=kurz",
      "detail_url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=1069315&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung",
      "professor": "Ludwig",
      "description": "Preparatory seminar for the major excursion to Costa Rica. Students will learn about the geography, ecology, and environmental issues of Costa Rica.",
      "semester": "SoSe 2025"
    }
  },
  {
    "path": [
      "Fakultät für Geowissenschaften",
      "Geographie",
      "Master Umweltsysteme und Nachhaltigkeit - Monitoring, Modellierung und Management",
      "2. Semester",
      "Seminare"
    ],
    "course": {
      "number": "20206",
      "name": "S (M.Sc.) Bodenfunktionen und Bodennutzung",
      "type": "Seminar",
      "url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=wtree&search=1&trex=step&root120251=756615%7C757727%7C758749%7C760860%7C762255%7C748842&P.vx=kurz",
      "detail_url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=1070404&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung",
      "professor": null,
      "schedule": [
        {
          "day": "Donnerstag",
          "time_start": "14:00",
          "time_end": "16:00",
          "rhythm": "wöchentlich",
          "first_date": "18.04.2025",
          "last_date": "18.07.2025",
          "room": "Raum 302, Geographisches Institut",
          "room_link": ""
        }
      ]
    }
  },
  {
    "path": [
      "Fakultät für Geowissenschaften",
      "Geographie",
      "Master Umweltsysteme und Nachhaltigkeit - Monitoring, Modellierung und Management",
      "2. Semester",
      "Vorlesungen"
    ],
    "course": {
      "number": "20202",
      "name": "V (M.Sc.) Böden und globale Stoffkreisläufe",
      "type": "Vorlesung",
      "url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=wtree&search=1&trex=step&root120251=756615%7C757727%7C758749%7C760860%7C762255%7C749060&P.vx=kurz",
      "detail_url": "https://lsf.verwaltung.uni-muenchen.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=1070472&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung",
      "professor": null,
      "description": "This lecture covers soil science and global material cycles. Topics include carbon sequestration, nitrogen cycle, and phosphorus dynamics in soil systems.",
      "semester": "SoSe 2025",
      "language": "Deutsch"
    }
  },
  {
    "path": [
      "Fakultät für Informatik",
      "Hauptstudium",
      "Theoretische Informatik",
      "Vorlesungen"
    ],
    "course": {
      "number": "19256",
      "name": "Basic Introduction to Advanced MRI and Analysis Techniques for Neuro-Applications",
      "type": "Vorlesung",
      "semester": "SoSe 2025",
      "sws": 2.0,
      "max_participants": 0,
      "language": "Englisch",
      "schedule": [
        {
          "day": "Mittwoch",
          "time_start": "16:00",
          "time_end": "17:30",
          "rhythm": "wöchentlich",
          "first_date": "23.04.2025",
          "last_date": "23.07.2025",
          "room": "Klinikum rechts der Isar (MRI), Seminarraum (33.3.25)",
          "room_link": ""
        }
      ],
      "description": "3 ECTS; Klinikum rechts der Isar (MRI), Seminarraum (33.3.25), Holbeinstr. 11, 3. OG; see schedule for more information; Registration per email is requested until April 20 to preibisch@tum.de",
      "professor": "Dr. Preibisch"
    }
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <TreeBrowser data={sampleData} />
    </div>
  );
};

export default Index;
