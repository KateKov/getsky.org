package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

func replaceFileContent(path string, old string, new string) error {
	read, err := ioutil.ReadFile(path)
	if err != nil {
		panic(err)
	}

	newContents := strings.Replace(string(read), old, new, -1)

	err = ioutil.WriteFile(path, []byte(newContents), 0)
	if err != nil {
		panic(err)
	}

	return nil
}

func main() {
	buildNumber := os.Getenv("TRAVIS_BUILD_NUMBER")
	if buildNumber == "" {
		buildNumber = "1"
	}

	f, err := os.Open("./VERSION.env")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	scanner.Scan()
	version := scanner.Text()
	fmt.Println(version)

	goPgkVersionPath := "./src/version.go"
	jsPgkVersionPath := "./web/package.json"
	oldVersion := "1.0.0.build1"
	newVersion := version + ".build" + buildNumber
	replaceFileContent(goPgkVersionPath, oldVersion, newVersion)
	replaceFileContent(jsPgkVersionPath, oldVersion, newVersion)
}
