from flask import Flask, request, jsonify, send_file
import os
import uuid
from flask_cors import CORS
from Vectordb_ops import create_and_store_embeddings, extract_text_from_pdf
from llm_api import llm_api_call
import threading
from flask_sqlalchemy import SQLAlchemy
# import mysql.connector
from Vectordb_ops import search_resumes
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# Set the database URI
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define your models
class JobPosting(db.Model):                                             #JobPosting is an object
    __tablename__ = 'jobpost'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    skills = db.Column(db.PickleType, nullable=False)


with app.app_context():
    db.create_all()

#create a folder for holding uploads
UPLOAD_FOLDER = 'uploads'
try:
    os.makedirs(UPLOAD_FOLDER)
except :
    pass

def generate_unique_id():
    return str(uuid.uuid4())

global_pdf_path=''

@app.route('/upload-resume', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['resume']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            filename = file.filename
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            new_filename = generate_unique_id() + os.path.splitext(filename)[1]
            os.rename(file_path, os.path.join(UPLOAD_FOLDER, new_filename))
            print(new_filename)
            pdf_path = os.path.join(UPLOAD_FOLDER, new_filename)
            #make pdf_path globally accessible
            print(pdf_path)
            global global_pdf_path
            global_pdf_path = pdf_path
            resume_text = extract_text_from_pdf(pdf_path)

            llm_response = llm_api_call(f'''
    This is a candidates resume data: {resume_text}
    Give 10 questions that can be asked to the candidate based on his skills, experience, and job titles. Note that the questions should be relevant to the job titles and skills mentioned in the resume. Also, make sure that the questions are not too generic. They should be specific to the candidate's skills and experience, and help to evaluate the candidates skills, aptitude, reasoning, communication skills, and problem solving skills.
''')

            #break llm response into questions
            questions = llm_response.split('\n')
            # print(questions)
            return jsonify({'message': 'Resume uploaded successfully', 'ok': True, 'questions': questions}), 200
        except Exception as e:
            return jsonify({'error': f'Error uploading file: {str(e)}'}), 500

    return jsonify({'error': 'Unknown error'}), 500


@app.route('/check-answers', methods=['POST'])
def check_answers():
    try:
        data = request.get_json()
        answers = data.get('answers')

        if not answers:
            return jsonify({'error': 'No answers provided'}), 400
        print(type(answers))
        all_answers = ', '.join(answers.values())
        print (type(all_answers))
        print (all_answers)
        response = llm_api_call(f'''These are the answers: {all_answers}. Return a very detailed evaluation of the candidate's skills, strengths, experience, education, soft skills, everything. and also give advice on how he can improve, or what he can learn. Your response should be in the following format: \n\nEvaluation: {'Your evaluation of the candidate'}\nAdvice:{'Your advice to the candidate'}. ''')
        response = response.replace('*', '')
        advice = response.split('Advice:')[1]
        evaluation = (response.split('Advice:')[0]).replace('\nAdvice:', '')
        
        global global_pdf_path
        print(global_pdf_path)        
        # print(pdf_path)
        create_and_store_embeddings(global_pdf_path, eval=evaluation)

        return jsonify({'evaluation': evaluation, 'advice': advice, 'ok': True}), 200 

    except Exception as e:
        print(e)
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


'''RECRUITER PART'''
@app.route('/post-job', methods=['POST'])
def post_job():
    '''Sending data to sql database'''
    job_details = request.get_json()
    # title = job_details.get('title')
    # description = job_details.get('description')
    print('POST JOB ENDPOINT HIT')
    try:
        # Create a new job posting instance
        new_job = JobPosting(
        title=job_details['title'],
        company=job_details['company'],
        location=job_details['location'],
        description=job_details['description'],
        skills=job_details['skills']
    )
        print('new_job created')
        db.session.add(new_job)
        print('ADDED')
        db.session.commit()
        print('COMMITED')

        return jsonify({'message': 'Job posted successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': f'Error: {str(e)}'}), 500

@app.route('/match-jobs', methods=['POST'])
def match_jobs():
    details = request.json
    title = details['title']
    description = details['description']
    skills = details['skills']
    #vector db search, return candidates
    modified_description = llm_api_call(f'''
"position": {title}
        "description": {description}
        "skills": {skills}
Modify the description above to make it more detailed and more specific. Such as, if there are some soft skills or other skills that might be required for this job, incorporate those into the modified job description. Make it more specific. ALso, keep in mind to use proper wordings. This modified description will be used to search in a vector database. So, for example if someone wants to hire a fresher, the vector db should not return details of an experienced candidate.

''')
    query=f'''
Position: {title},
Skills: {skills},
Description: {modified_description},
'''
    results = search_resumes(query=query)
    print(type(results))
    for key in results.keys():
        print(key)
        #ids is an array of arrays
    print(results['ids'])
    # resume_path = os.path.join(UPLOAD_FOLDER, filename)
    resume_list=[]
    for i in range(len(results['ids'][0])):
        resume_list.append(str(results['ids'][0][i]))
        
        return jsonify({'title': title,
                        'files': results['ids'][0],
                        }), 200

    #vector db search, return candidates

@app.route('/get-resume/<filename>', methods=['GET'])
def get_resume(filename):

    resume_path = os.path.join(UPLOAD_FOLDER, filename)

    if os.path.exists(resume_path):
        try:
            return send_file(resume_path, as_attachment=True, download_name=filename)
        except Exception as e:
            print(f"Error sending file: {e}")
            return jsonify({'error': 'Internal server error'}), 500
    else:
        return jsonify({'error': 'Resume not found'}), 404

@app.route('/postings', methods=['GET'])
def get_postings():
    '''fetch posted jobs data from sql database and return'''
    try:
        postings = JobPosting.query.all()
        job_postings = [{
            'id': job.id, 
            'title': job.title, 
            'company': job.company,
            'location': job.location,
            'description': job.description,
            'skills': job.skills
            } for job in postings]
        return jsonify(job_postings), 200
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500

    



@app.route('/')
def hello():
    return 'Hello, World!'


app.run(debug=True, port=3000)