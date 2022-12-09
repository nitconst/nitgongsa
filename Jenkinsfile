node {
        stage('Ready') {
            sh "echo 'Ready Jenkins'"
            checkout scm
        } 

        stage('Build') {
            sh "echo 'run docker-compose gogo'"
            sh "docker-compose up -d"
        }

        // stage('Exchange') {
        //     sh "echo 'Stop Previous Container'"
        //     sh "docker stop nit-gongsa"
        //     sh "docker rm nit-gongsa"
        // }
    }
