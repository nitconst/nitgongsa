node {
        stage('Ready') {
            sh "echo 'Ready Jenkins'"
            checkout scm
        }

        stage('Tests') {
            sh "echo 'test'"
            sh "pwd"
        } 

        // stage('Build') {
        //     sh "echo 'run docker-compose gogo'"
        //     sh "docker-compose build"
        // }

        // stage('Exchange') {
        //     sh "echo 'Stop Previous Container'"
        //     sh "docker stop nit-gongsa"
        //     sh "docker rm nit-gongsa"
        // }

        // stage('Start') {
        //     sh "echo '해치웠나?'"
        //     sh "docker-compose up -d"
        // }
    }
