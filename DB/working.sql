SELECT * FROM answer_sheet


SELECT * FROM question_paper
INNER JOIN question_paper_question_mapping ON question_paper.id = question_paper_question_mapping.question_paper_id
INNER JOIN question ON question_paper_question_mapping.question_id = question.id
LEFT OUTER JOIN answer_sheet ON answer_sheet.question_id = question.id
LEFT OUTER JOIN question_category ON question_category.id = question.question_category_id


SELECT * FROM student
INNER JOIN USER ON user.id = student.user_id
INNER JOIN student_exam_mapping ON student_exam_mapping.student_id = student.id OR student_exam_mapping.batch_id = student.batch_id
INNER JOIN question_paper ON question_paper.id = student_exam_mapping.question_paper_id
INNER JOIN question_paper_question_mapping ON question_paper_question_mapping.question_paper_id = question_paper.id
INNER JOIN question ON question.id = question_paper_question_mapping.question_id
INNER JOIN answer_sheet
WHERE user.id = 1



SELECT 
question_category.category_name AS CategoryName,
COUNT(*) AS TotalQuestions,
COUNT(CASE WHEN answer_sheet.is_question_answered = 1 THEN 1 ELSE 0 END) AS Attempted,
SUM(CASE WHEN answer_sheet.answer_id = question.right_answer_ids THEN 1 ELSE 0 END) AS RightAnswers,
SUM(CASE WHEN answer_sheet.answer_id = question.right_answer_ids THEN 0 ELSE 1 END) AS WrongAnswers
FROM answer_sheet
INNER JOIN question_paper_question_mapping ON question_paper_question_mapping.question_id = answer_sheet.question_id
INNER JOIN student ON student.id = answer_sheet.student_id
INNER JOIN USER ON user.id = student.user_id
INNER JOIN question ON question.id = answer_sheet.question_id
INNER JOIN question_category ON question_category.id = question.question_category_id
WHERE  user.id = 1
AND question_paper_question_mapping.question_paper_id = 36
GROUP BY question_category.id

SELECT * FROM question_paper_question_mapping

SELECT * FROM exam








SELECT DISTINCT
        question_paper.id AS question_paper_id,
        question_paper.total_time_minutes,
        question.id AS question_id,
        question.question_para1,
        question.question_para2,
        question_types.question_type,
        question_category.category_name,
        answer.id AS answer_id,
	answer.answer_text
        FROM
        question_paper
        INNER JOIN question_paper_question_mapping ON question_paper_question_mapping.question_paper_id = question_paper.id
        INNER JOIN question ON question.id = question_paper_question_mapping.question_id
        INNER JOIN question_types ON question_types.id = question.question_type_id
        INNER JOIN question_category ON question_category.id = question.question_category_id
        INNER JOIN answer ON FIND_IN_SET(answer.id, question.answer_ids)
        INNER JOIN student_exam_mapping ON student_exam_mapping.question_paper_id = question_paper.id
        INNER JOIN batch ON batch.id = student_exam_mapping.batch_id
        INNER JOIN student ON student.batch_id = batch.id
        WHERE student.user_id = 1 AND question_paper.id = 34



 SELECT
        question_category.category_name AS CategoryName,
        COUNT(*) AS TotalQuestions,
        COUNT(CASE WHEN answer_sheet.is_question_answered = 1 THEN 1 ELSE 0 END) AS Attempted,
        SUM(CASE WHEN answer_sheet.answer_id = question.right_answer_ids THEN 1 ELSE 0 END) AS RightAnswers,
        SUM(CASE WHEN answer_sheet.answer_id = question.right_answer_ids THEN 0 ELSE 1 END) AS WrongAnswers
        FROM answer_sheet
        INNER JOIN question_paper_question_mapping ON question_paper_question_mapping.question_id = answer_sheet.question_id
        INNER JOIN student ON student.id = answer_sheet.student_id
        INNER JOIN USER ON user.id = student.user_id
        INNER JOIN question ON question.id = answer_sheet.question_id
        INNER JOIN question_category ON question_category.id = question.question_category_id
        WHERE  user.id = 1
        AND question_paper_question_mapping.question_paper_id = 36
        GROUP BY question_category.id

SELECT * FROM answer_sheet
        INNER JOIN question_paper_question_mapping ON answer_sheet.question_id = question_paper_question_mapping.question_id
        INNER JOIN question_paper ON question_paper.id = question_paper_question_mapping.question_paper_id
        WHERE question_paper.id = 36
        
        
        
SELECT 
        question_category.category_name AS CategoryName,
        COUNT(*) AS TotalQuestions,
        COUNT(CASE WHEN answer_sheet.is_question_answered = 1 THEN 1 ELSE 0 END) AS Attempted,
        SUM(CASE WHEN answer_sheet.answer_id = question.right_answer_ids THEN 1 ELSE 0 END) AS RightAnswers,
        SUM(CASE WHEN answer_sheet.answer_id = question.right_answer_ids THEN 0 ELSE 1 END) AS WrongAnswers
        FROM answer_sheet
        INNER JOIN question_paper_question_mapping ON question_paper_question_mapping.question_id = answer_sheet.question_id
        INNER JOIN student ON student.id = answer_sheet.student_id
        INNER JOIN USER ON user.id = student.user_id
        INNER JOIN question ON question.id = answer_sheet.question_id
        INNER JOIN question_category ON question_category.id = question.question_category_id
        WHERE  user.id = 1 
        AND question_paper_question_mapping.question_paper_id = 36 
        GROUP BY question_category.id


-- Final query        
SELECT 
	question_category.id,
        question_category.category_name AS CategoryName,
        question.id,
        question.question_para1,
        question.question_para2,
        question.answer_ids,
        answer_sheet.is_question_answered,
        answer_sheet.answer_id,
        question.right_answer_ids
        FROM answer_sheet
        INNER JOIN question_paper_question_mapping ON question_paper_question_mapping.question_id = answer_sheet.question_id
        INNER JOIN student ON student.id = answer_sheet.student_id
        INNER JOIN USER ON user.id = student.user_id
        INNER JOIN question ON question.id = answer_sheet.question_id
        INNER JOIN question_category ON question_category.id = question.question_category_id
        WHERE  user.id = 1 
        AND question_paper_question_mapping.question_paper_id = 36
               
        
 -- ---------------------
 
 select * from activity_type
 
 select * from answer
 
 select * from activity_type
 
 
 INSERT INTO activity_type (activity) VALUES ('student registered exam') ;
 insert into activity_type (activity) values ('student started exam') ;
 INSERT INTO activity_type (activity) VALUES ('student selected an option') ;
 INSERT INTO activity_type (activity) VALUES ('student unselected an option'); 
 INSERT INTO activity_type (activity) VALUES ('student marked an option for review'); 
 INSERT INTO activity_type (activity) VALUES ('student unmarked an option for review');
 INSERT INTO activity_type (activity) VALUES ('student clicked on report issue');
 INSERT INTO activity_type (activity) VALUES ('student submitted a question');
 INSERT INTO activity_type (activity) VALUES ('student submitted a exam');
 INSERT INTO activity_type (activity) VALUES ('student clicked on a question');
 
 
 select * from activity_tracker
 
 insert into activty_tracker (user_id, activity_type_id, activity_target_id, activity_datetime)
 value ()
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
  
  
 

