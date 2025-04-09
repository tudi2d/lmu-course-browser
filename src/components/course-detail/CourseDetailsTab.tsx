import React from "react";
import { Course } from "@/services/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CourseDetailsTabProps {
  courseData: Course;
}

export const CourseDetailsTab: React.FC<CourseDetailsTabProps> = ({
  courseData,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {courseData.professor && (
          <div className="mb-3">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Professor
            </h3>
            <p className="text-sm">{courseData.professor}</p>
          </div>
        )}

        {courseData.type && (
          <div className="mb-3">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Typ
            </h3>
            <p className="text-sm">{courseData.type}</p>
          </div>
        )}

        {courseData.semester && (
          <div className="mb-3">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Semester
            </h3>
            <p className="text-sm">{courseData.semester}</p>
          </div>
        )}

        {courseData.language && (
          <div className="mb-3">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Sprache
            </h3>
            <p className="text-sm">{courseData.language}</p>
          </div>
        )}

        {courseData.sws && (
          <div className="mb-3">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              SWS
            </h3>
            <p className="text-sm">{courseData.sws}</p>
          </div>
        )}

        {courseData.max_participants !== undefined &&
          courseData.max_participants >= 0 && (
            <div className="mb-3">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Maximale Teilnehmerzahl
              </h3>
              <p className="text-sm">{courseData.max_participants}</p>
            </div>
          )}

        {courseData.departments && courseData.departments.length > 0 && (
          <div className="mb-3">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Departments
            </h3>
            <p className="text-sm">{courseData.departments.join(", ")}</p>
          </div>
        )}

        {courseData.degree_programs &&
          courseData.degree_programs.length > 0 && (
            <div className="mb-3">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Degree Programs
              </h3>
              <p className="text-sm">{courseData.degree_programs.join(", ")}</p>
            </div>
          )}

        {courseData.faculties && courseData.faculties.length > 0 && (
          <div className="mb-3">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Faculties
            </h3>
            <p className="text-sm">{courseData.faculties.join(", ")}</p>
          </div>
        )}
      </div>

      {/* Additional information sections in accordion */}
      <AdditionalDetailsAccordion courseData={courseData} />
    </>
  );
};

interface AdditionalDetailsAccordionProps {
  courseData: Course;
}

const AdditionalDetailsAccordion: React.FC<AdditionalDetailsAccordionProps> = ({
  courseData,
}) => {
  return (
    <Accordion type="single" collapsible className="mt-6">
      {courseData.literature && (
        <AccordionItem value="literature">
          <AccordionTrigger className="text-sm">Literatur</AccordionTrigger>
          <AccordionContent className="text-sm">
            {courseData.literature}
          </AccordionContent>
        </AccordionItem>
      )}

      {courseData.requirements && (
        <AccordionItem value="requirements">
          <AccordionTrigger className="text-sm">
            Voraussetzungen
          </AccordionTrigger>
          <AccordionContent className="text-sm">
            {courseData.requirements}
          </AccordionContent>
        </AccordionItem>
      )}

      {courseData.target_group && (
        <AccordionItem value="target_group">
          <AccordionTrigger className="text-sm">Zielgruppe</AccordionTrigger>
          <AccordionContent className="text-sm">
            {courseData.target_group}
          </AccordionContent>
        </AccordionItem>
      )}

      {courseData.registration_info && (
        <AccordionItem value="registration_info">
          <AccordionTrigger className="text-sm">Anmeldung</AccordionTrigger>
          <AccordionContent className="text-sm">
            {courseData.registration_info}
          </AccordionContent>
        </AccordionItem>
      )}

      {courseData.evaluation_method && (
        <AccordionItem value="evaluation_method">
          <AccordionTrigger className="text-sm">Prüfungsform</AccordionTrigger>
          <AccordionContent className="text-sm">
            {courseData.evaluation_method}
          </AccordionContent>
        </AccordionItem>
      )}

      {courseData.registration_periods &&
        courseData.registration_periods.length > 0 && (
          <AccordionItem value="registration_periods">
            <AccordionTrigger className="text-sm">
              Registration Periods
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              {Array.isArray(courseData.registration_periods)
                ? courseData.registration_periods.map((period, idx) => (
                    <div key={idx} className="mb-2">
                      {typeof period === "string"
                        ? period
                        : JSON.stringify(period)}
                    </div>
                  ))
                : JSON.stringify(courseData.registration_periods)}
            </AccordionContent>
          </AccordionItem>
        )}
    </Accordion>
  );
};
