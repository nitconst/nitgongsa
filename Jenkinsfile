node {
        stage('Ready') {
            sh "echo 'Ready Jenkins'"
            checkout scm
        }

        stage('Build') {
            sh "echo 'Build Dockerfile'"
            sh "docker build -t 172.16.200.33:5000/gongsa_real ."
        }

        stage('Push'){
            sh "echo 'Push Docker Image'"
            sh "docker image push 172.16.200.33:5000/gongsa_real:latest"
        }

        // stage('Exchange') {
        //     sh "echo 'Stop Previous Container'"
        //     sh "docker stop nit-gongsa"
        //     sh "docker rm nit-gongsa"
        // }

        stage('Deploy') {
            sh "echo 'Deply Development Server'"
            sh "docker run --name nit-gongsa -d -p 8080:5001 172.16.200.33:5000/gongsa_real"
        }
    }
