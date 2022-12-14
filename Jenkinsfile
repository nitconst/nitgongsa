node {
        stage('Ready') {
            sh "echo 'Ready Jenkins'"
            checkout scm
        }

        stage('Tests') {
            sh "echo 'test'"
            sh "ls"
        }

        stage('Build') {
            sh "echo 'run docker-compose gogo'"
            sh "docker-compose up -d"
        }
    }
