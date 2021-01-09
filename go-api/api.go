package main

import "log"
import "fmt"
import "net/http"
import "strconv"
import "time"
import "math/rand"
import "encoding/json"
import "database/sql"

import _ "github.com/go-sql-driver/mysql"
import "github.com/gorilla/handlers"
import "github.com/gorilla/mux"

type Question struct {
	Question    string `json:"question"`
	Answer      string `json:"answer"`
	Description string `json:"description"`
}

type Domain struct {
	ID     int    `json:"id"`
	Domain string `json:"domain"`
}

var question_result Question
var domain_result Domain

func Shuffle(slice []Question) {
	r := rand.New(rand.NewSource(time.Now().Unix()))
	for n := len(slice); n > 0; n-- {
		randIndex := r.Intn(n)
		slice[n-1], slice[randIndex] = slice[randIndex], slice[n-1]
	}
}

func getQuestions(w http.ResponseWriter, r *http.Request) {
	var questions []Question
	db, err := sql.Open("mysql", "goapi:sqlpass@tcp(172.18.0.2:3306)/goapi")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	rows, err := db.Query("SELECT question, answer, description FROM goapi.questions")
	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		err = rows.Scan(&question_result.Question, &question_result.Answer, &question_result.Description)
		if err != nil {
			log.Fatal(err)
		}

		question := question_result
		questions = append(questions, question)
	}
	Shuffle(questions)
	json.NewEncoder(w).Encode(questions)
}

func getDomains(w http.ResponseWriter, r *http.Request) {
	var domains []Domain

	db, err := sql.Open("mysql", "goapi:sqlpass@tcp(172.18.0.2:3306)/goapi")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	rows, err := db.Query("SELECT id, domain FROM goapi.domains")
	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		err = rows.Scan(&domain_result.ID, &domain_result.Domain)
		if err != nil {
			log.Fatal(err)
		}

		domain := domain_result
		domains = append(domains, domain)
	}

	json.NewEncoder(w).Encode(domains)
	log.Printf("getDomains() function has been called.")
}

func getDomainQuestions(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	subject_index, _ := strconv.Atoi(params["id"])

	// Query DB based on subject id
	var questions []Question

	db, err := sql.Open("mysql", "goapi:sqlpass@tcp(172.18.0.2:3306)/goapi")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	query := fmt.Sprintf("SELECT question, answer, description FROM goapi.questions WHERE domain_id = %d", subject_index)

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		err = rows.Scan(&question_result.Question, &question_result.Answer, &question_result.Description)
		if err != nil {
			log.Fatal(err)
		}

		question := question_result
		questions = append(questions, question)
	}

	Shuffle(questions)
	json.NewEncoder(w).Encode(questions)

}

func submitQuestions(w http.ResponseWriter, r *http.Request) {
	log.Println("submitQuestions is called")

	var submission Question

	json.NewDecoder(r.Body).Decode(&submission)

	db, err := sql.Open("mysql", "goapi:sqlpass@tcp(172.18.0.2:3306)/goapi")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	res, err := db.Exec(fmt.Sprintf("INSERT INTO goapi.questions (id, question, answer, description, domain_id) VALUES(NULL, '%s', '%s', '%s', 5)",
		submission.Question, submission.Answer, submission.Description))
	if err != nil {
		log.Fatal(err)
	}

	rowCnt, err := res.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Wrote %d new record(s) - ('%s', '%s', '%s')",
		rowCnt, submission.Question, submission.Answer, submission.Description)
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/questions", getQuestions).Methods("GET")
	r.HandleFunc("/domains", getDomains).Methods("GET", "OPTIONS")
	r.HandleFunc("/questions/{id}", getDomainQuestions).Methods("GET")
	r.HandleFunc("/submit", submitQuestions).Methods("POST")

	corsAllowedOrigins := handlers.AllowedOrigins([]string{"*"})
	corsAllowedHeaders := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	corsAllowedMethods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	log.Fatal(http.ListenAndServe(":8000", handlers.CORS(corsAllowedOrigins, corsAllowedHeaders, corsAllowedMethods)(r)))
}
