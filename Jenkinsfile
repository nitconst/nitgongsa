node {
        stage('Ready') {
            sh "echo 'Ready Jenkins'"
            checkout scm
        }

        stage('test') {
            withEnv(["PATH=$PATH:~/.local/bin"]){
                    sh "bash test.sh"
                }
        }   

        stage('Build') {
            sh "echo 'run docker-compose'"
            sh "docker-compose build app"
        }

        // stage('Exchange') {
        //     sh "echo 'Stop Previous Container'"
        //     sh "docker stop nit-gongsa"
        //     sh "docker rm nit-gongsa"
        // }

        stage('Deploy') {

            sh(script: 'docker-compose up -d production') 

        }
    }
