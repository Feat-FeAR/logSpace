---
title: "ENA Browser"
weight: 2
draft: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# ENA Browser
The official guidelines for data submission and retrieval for the
[European Nucleotide Archive (ENA)](https://www.ebi.ac.uk/ena/browser/home) can
be found [here](https://ena-docs.readthedocs.io/en/latest/index.html). That
documentation is very clear and extremely comprehensive, but it needs some time
to be read and mastered by the novice. In fact, even the average user may find
it difficult to remember the exact procedures for file uploading from time to
time.

Therefore, in case your only interest is in securing and making your RNA-Seq
experiment available to the world (and your future self), this tutorial gives
the essential steps for uploading a set of FASTQ files (_raw reads_) to the ENA
repository through the _interactive submission system_ (aka the _Webin Portal
service_). Here we'll assuming that
1. you have already registered a _Webin Submission Account_;
1. you are already familiar with the _ENA Metadata Model_ (if not, you can find
	[here](https://feat-fear.github.io/logSpace/docs/genomics/INSDC/) a quick
	overview of the great _International Nucleotide Sequence Database
	Collaboration_ initiative);


## Register a Study
To register a _Study_ (also referred to as _Project_) through the Webin Portal
1. go to the
	[_Webin submission portal_](https://www.ebi.ac.uk/ena/submit/webin/login)
	and log in with your Webin credentials;
1. select the `Register Study` button;
1. fill out the form to describe your study (most of these values can be edited
	later if needed);
1. press `Submit` button;
1. make a note of two accession numbers that will be assigned to the study;
	- the ___BioProject___ accession starts with _PRJEB_ and is the one
		typically used in journal publications;
	- the ___Study___ accession is an alternative accession number that starts
		with _ERP_.
1. You may return to the dashboard and select `Studies Report` to review
	registered studies.


## Register Samples


https://ena-docs.readthedocs.io/en/latest/submit/general-guide/submissions-portal.html