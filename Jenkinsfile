node {
        stage('Ready') {
            sh "echo 'Ready Jenkins'"
            checkout scm
        }

        stage('Clear') {
            sh "echo 'Clearing previous files wa'"
            sh "docker-compose down --remove-orphans"
        }

        stage('Build') {
            sh "echo 'run docker-compose gogo'"
            sh "docker-compose up -d"
        }
    }
