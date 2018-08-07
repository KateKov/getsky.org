package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

func replaceFileContent(path string, new string) error {
	/* #nosec */
	read, err := ioutil.ReadFile(path)
	if err != nil {
		panic(err)
	}

	newContents := strings.Replace(string(read), "1.0.0.0", new, -1)

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
	closeFile := func() {
		if err := f.Close(); err != nil {
			panic(err)
		}
	}
	defer closeFile()
	scanner := bufio.NewScanner(f)
	scanner.Scan()
	version := scanner.Text()
	fmt.Println(version)

	goPgkVersionPath := "./src/version.go"
	jsPgkVersionPath := "./web/package.json"
	newVersion := version + "." + buildNumber
	err = replaceFileContent(goPgkVersionPath, newVersion)
	if err != nil {
		panic(err)
	}
	err = replaceFileContent(jsPgkVersionPath, version)
	if err != nil {
		panic(err)
	}

	os.Setenv("VERSION", newVersion)
}
