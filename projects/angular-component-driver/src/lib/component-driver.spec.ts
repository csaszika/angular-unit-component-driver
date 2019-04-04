import {createSpyFromClass, Spy} from 'jasmine-auto-spies';

import { componentTestingSetup } from './component-testing-setup';
import {
  QuestionComponent,
  QuestionComponentDriver,
  QuestionService,
  AnswerDirective,
  QuestionData,
  LoggerService
} from './fake-classes-to-test';

function testingSetup(loggerService: Spy<LoggerService>) {
  return componentTestingSetup({
    componentClass: QuestionComponent,
    driver: QuestionComponentDriver,
    servicesToStub: [QuestionService],
    overrideProviders: [{ clazz: LoggerService, mockValue: loggerService}],
    declarations: [AnswerDirective]
  });
}

describe('QuestionComponent', () => {
  let questionComponentDriver: QuestionComponentDriver;
  let questionServiceSpy: Spy<QuestionService>;
  const loggerService: Spy<LoggerService> = createSpyFromClass(LoggerService);

  beforeEach(() => {
    questionComponentDriver = testingSetup(loggerService).createComponentDriver();
    questionServiceSpy = questionComponentDriver.injector.get(QuestionService);
  });

  describe('GIVEN a question is available THEN it is displayed', () => {
    let questionData: QuestionData;

    Given(() => {
      questionData = {
        question: 'What do you prefer ?',
        answers: ['pizza', 'burger']
      };

      questionServiceSpy.getQuestion.and.nextWith(questionData);
    });

    When(() => {
      questionComponentDriver.detectChanges();
    });

    Then(() => {
      expect(questionComponentDriver.componentInstance.questionData).toEqual(questionData);

      expect(questionComponentDriver.questionElement.textContent).toContain(questionData.question);

      const [btnPrevious, btnNext] = questionComponentDriver.buttonElements;
      expect(btnPrevious.textContent).toContain('Previous');
      expect(btnNext.textContent).toContain('Next');

      expect(questionComponentDriver.firstAnswerDirective.answer).toBe(questionData.answers[0]);

      const [firstAnswer, secondAnswer] = questionComponentDriver.answerDirectives;
      expect(firstAnswer.answer).toBe(questionData.answers[0]);
      expect(secondAnswer.answer).toBe(questionData.answers[1]);
      expect(loggerService.log).toHaveBeenCalledWith(questionData);
    });
  });

  describe('GIVEN nonexistent element or directive THEN they are not displayed', () => {
    Then(() => {
      expect(questionComponentDriver.nonexistentElement).toBeFalsy();
      expect(questionComponentDriver.nonexistentElements).toEqual([]);
      expect(questionComponentDriver.nonexistentDirective).toBeFalsy();
      expect(questionComponentDriver.nonexistentDirectives).toEqual([]);
    });
  });
});
