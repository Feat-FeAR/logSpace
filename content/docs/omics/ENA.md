---
title: "The ENA Archive"
weight: 60
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# The ENA Archive

<br>
<br>
<div style="text-align: center;">
	{{< figure src="/images/ENA_logo_crop.png" title="ENA logo" width=500 >}}
</div>
<br>
<br>

While the
[official ENA guidelines](https://ena-docs.readthedocs.io/en/latest/index.html)
for data submission and retrieval across the
[European Nucleotide Archive](https://www.ebi.ac.uk/ena/browser/home) are very
thorough and comprehensive, they may also appear a bit fragmented and slightly
redundant, thus requiring some time to be read and mastered by the novice. In
fact, even the average user may have a hard time remembering the exact
procedures for uploading and submitting files from time to time.

In case your only interest is in securing and making your RNA-Seq experiment
available to the world (and your future self), this tutorial gives the essential
steps for uploading a set of FASTQ files (_raw reads_) to the ENA repository
through the _interactive submission system_ (aka the _Webin Portal service_).
Here we'll assuming that
1. you have already registered a _Webin Submission Account_ (and you remember
	where you put your credentials);
1. you are already familiar with the _ENA Metadata Model_ (if not, you can find
	[here](../INSDC/) a quick overview of the great _International Nucleotide
	Sequence Database Collaboration_ initiative);
1. your raw reads have already been de-multiplexed and are in _gzip-compressed_
	FASTQ format (`.fastq.gz`).

## Register a Study
To register a _Study_ (also referred to as _Project_) through the Webin Portal
1. go to the
	[_Webin submission portal_](https://www.ebi.ac.uk/ena/submit/webin/login)
	and log in with your Webin credentials;
1. select the `Register Study` button and fill out the form to describe your
	study (most of these values can be edited later if needed);
1. press `Submit` button and save the `Webin-accessions-<time_stamp>.txt` text
	file, or make a note of the accession numbers that will be assigned to your
	study and submission:
	- the ___BioProject___ study accession starts with _PRJEB_ and it is the one
		typically used in journal publications;
	- the ENA ___Study___ accession starts with _ERP_ and it is an alternative
		accession number for the study;
	- the ENA ___Submission___ accession refers to the _submission process_
		rather than to the study itself and it starts with _ERA_.
1. You may return to the dashboard and select `Studies Report` to review
	registered studies and their accessions.

## Register Samples
To register _Samples_ interactively (i.e., through the Webin Portal)
1. go to the
	[_Webin submission portal_](https://www.ebi.ac.uk/ena/submit/webin/login)
	and log in with your Webin credentials;
1. click the `Register Samples` button and select
	`Download spreadsheet to register samples` to expand the checklist
	selection menu;
1. select a checklist group and then the most appropriate checklist among the
	available options;
{{< hint info >}}
__NOTE__  
In the absence of a checklist specific (and absolutely adherent!) to your
experimental model, choose the ___ENA default sample___ checklist.
{{< /hint >}}
1. inspect _optional_ (and possibly _recommended_) fields;
1. consider using the `Add custom field` box to the top-left to define
	additional attributes not included in any checklist;
1. click `Next` and then the `Download TSV Template` to get a spreadsheet based
	on your selections (e.g.,
	`Checklist_ENA-default sample checklist_xxxxxxxxxxxxx.tsv`);
1. open the template in an appropriate spreadsheet editing program and complete
	it by filling out __one line for each *Sample*__ ;
{{< hint info >}}
__INFO__  
The most fundamental attribute to any sample is its taxonomic classification
(i.e., the `tax_id` and binomial `scientific_name` fields) according to the
[NCBI Taxonomy](https://www.ncbi.nlm.nih.gov/taxonomy) database. Make sure you
are familiar with the
[ENA’s taxonomy services](https://ena-docs.readthedocs.io/en/latest/faq/taxonomy.html)
and use the correct taxonomy to describe your samples. E.g.,
`tax_id: 9606` and `scientific_name: Homo sapiens` for human samples.
{{< /hint >}}
1. do not remove the first three lines of the spreadsheet, but use row 3
	(`#units`) to specify units where required by the checklist;
{{< hint info >}}
__INFO__  
Use the
[_sample checklists portal_](https://www.ebi.ac.uk/ena/browser/checklists)
to look up the requirements and restrictions for each field. E.g.,
[Checklist: ERC000011](https://www.ebi.ac.uk/ena/browser/view/ERC000011)
describes the _ENA default sample checklist_.
{{< /hint >}}
{{< hint warning >}}
__WARNING__  
If you cannot provide a value for a mandatory field within a checklist, use one
of the
[INDSC accepted terms](https://ena-docs.readthedocs.io/en/latest/submit/samples/missing-values.html)
for missing value reporting.
{{< /hint >}}
1. you can still add custom fields at this step, just by inserting new column
	headers;
1. once your spreadsheet content is complete, save the file, go back to the
	`Register Samples` interface in Webin Portal and expand the
	`Upload filled spreadsheet to register samples` option. Use the
	`Browse` button to find the spreadsheet you wish to submit, then click the
	`Submit Completed Spreadsheet` button.

At this point your _Samples_ will be validated and---if accepted---accession
numbers will be reported (possibly save them as a second
`Webin-accessions-<time_stamp>.txt` text file). Actually, every _Sample_ will
receive _two_ accession numbers:
- a ___BioSample___ accession starting with _SAMEA_ (see `Samples Report`);
- an ENA ___Sample___ accession, which is an alternative accession number
	starting with _ERS_.

Note that at this point __you have not submitted any data__, but you have laid
the groundwork for this by providing _Sample_ metadata.

## Upload Reads
When submitting data to ENA, it is often necessary to upload the data files in
advance of submission in the FTP area associated with your account (aka your
_private Webin file upload area_). 

### Prepare MD5 Hashes
For each file submitted to the archive you must provide an MD5 value. ENA will
then re-compute and verify the MD5 checksum after file upload to make sure that
the file transfer was completed successfully, without changes to contents.
Specifically, you can register your file’s MD5 value by redirecting the output
of the command `md5sum <file_name>` to a second (.md5) text file and uploading
this along with the data file. Alternatively, you can make a note of the value
and enter it when prompted during the submission process. If you choose to make
and upload your own _.md5_ file, be sure that
1. it contains ___only___ the 32 digit MD5 value for a single file;
1. MD5 hash is in lower case letters;
1. its file name matches the name of the hashed file.

### Transfer by FTP
To upload files to your _private Webin file upload area_ using FileZilla FTP
client
1. launch __FileZilla__;
1. set the _binary mode_ (`Transfer` menu > `Transfer Type` > `Binary`);
1. open the `Site Manager` menu with the button at the top-left;
1. if still unset, use the `New site` option to add the ENA host;
1. set the following parameters:
	- __Protocol__: `FTP - File Transfer Protocol`
	- __Host__: `webin2.ebi.ac.uk`
	- __Port__: (_leave blank_)
	- __Encryption__: `Require explicit FTP over TLS`
	- __Logon Type__: `Normal`
	- As for __User__ and __Password__, the authentication is done using your
		Webin submission account name and password;
1. click `Connect`;
1. search for the file(s) you want to upload using the tree on the left panel;
1. drag and drop the files you want to upload from the lower left panel to the
	lower right panel (typically, 2 PE FASTQ files + 2 .md5 files per _Run_);
1. once your transfer is successful, close the application.

{{< hint info >}}
__NOTE__  
The __Webin File Uploader__ is a Java web start application provided by ENA
(downloadable from Webin Portal) that can be used as an alternative GUI to
upload your files to ENA's data upload area. Compared to FileZilla, it offers
far fewer options, but it is simpler and automatically creates .md5 files and
uploads them for you.
{{< /hint >}}
{{< hint warning >}}
__WARNING__  
The _data upload areas_ are provided as a temporary place in which data are
held while in transit. As such, they are neither intended nor suitable for any
longer-term storage of data. ENA expects any given data file to remain in a data
upload area for no longer than __2 months__ before the instruction is given by
the user to submit the file. Accordingly, ENA reserves the right to routinely
delete any data files that persist in them for more than 2 months.

ENA place no absolute limit within the 2-month period on the total volume of
user data that may exist in a data upload area at any one time. However, ENA
strongly encourages _continuous_ data submissions where files are uploaded and
submitted in small patches of __few Terabytes or less__ and expect that volumes
would __not exceed 10 Terabytes under normal circumstances__.
{{< /hint >}}

{{< hint warning >}}
__WARNING__  
Users attempting to connect from an institutional network may find that their IT
services department has placed restrictions on their ability to connect to FTP
services. This information could be useful in getting ENA service whitelisted.

FTP is used in _passive mode_ and connection will be opened to one of the below
ports:
- 40000
- 50000

Access to port __21__ is required for the following IP address
(`webin2.ebi.ac.uk`):
- 193.62.193.143
{{< /hint >}}

## Submit Data
Now it's time to associate each _Run_ (i.e., FASTQ file pair) with its _Sample_
accession in order to submit the previously uploaded data to the ENA archive.

{{< hint info >}}
__INFO__  
In ENA, raw read files (i.e., FASTQ files) are contained by _Run_ objects, which
point to the location of the files in an FTP directory. A _Run_ of sequencing is
always linked with one _Experiment_ object, which describes the library
preparation and sequencing protocol. In turn, _Experiments_ are linked with one
_Sample_ and one _Study_, according to the
[__ENA Metadata Model__](../INSDC/).
{{< /hint >}}

To Submit Raw Reads Interactively,
1. go to the
	[_Webin submission portal_](https://www.ebi.ac.uk/ena/submit/webin/login)
	and log in with your Webin credentials;
1. select the `Submit Reads` button;
1. expand the `Download spreadsheet template for Read submission` section;
1. choose the file format which applies to your _Submission_ (note that there
	are different options for single and paired FASTQ files);
1. click `Next` and then the `Download TSV Template` to get a copy of your
	customized submission template spreadsheet (e.g.,
	`fastq2_template_xxxxxxxxxxx.tsv`);
1. open the template in an appropriate spreadsheet editing program and complete
	it by filling out __one line for each *Experiment/Run* (pair)__;
1. when editing the spreadsheet, keep in mind that
	- existing column names are not meant to be edited;
	- each row of your spreadsheet should describe the files and metadata for
		exactly one _Experiment_/_Run_-pair;
	- `study` and `sample` fields can be filled out with either ENA or
		_BioStudies_/_BioSamples_ accessions;
	- _file name_ fields (i.e., `forward_file_name` for R1 and
		`reverse_file_name` for R2, in the case of PE reads) must exactly match
		the name of a file already present in your account’s upload area;
	- _file MD5_ fields (i.e., `forward_file_md5` for R1 and `reverse_file_md5`
		for R2, in the case of PE reads) are mandatory only if you didn't use
		the _Webin File Uploader_ or upload the checksum using a .md5 file.
1. Once your spreadsheet content is complete, save the file, return to the
	`Submit Reads` interface in Webin Portal and expand the
	`Upload filled spreadsheet template for Read submission` section. Use the
	`Browse` button to find the spreadsheet you wish to submit, then click the
	`Submit Completed Spreadsheet` button to have your files validated and
	submitted.

Your submitted data files will then be entered into a processing pipeline which
will check their validity before moving them to an archive. If metadata
validation is successful, you will receive a confirmation of the assigned
_Experiment_ and _Run_ accessions (possibly save them as a third
`Webin-accessions-<time_stamp>.txt` text file). Actually, every read submission
will receive _two_ accession numbers:
- a ___Run___ accession starting with _ERR_ ;
- an ___Experiment___ accession starting with _ERX_ ;

even if, in this case, they are not truly equivalent accessions for the same
_object type_, since only _Runs_ are actually associated with _data_ (i.e.,
FASTQ) files, while _Experiments_ only contain metadata related to sequencing
methods.

## Review Submissions
To review the content and status of your existing _Submissions_, login to the
[_Webin submission portal_](https://www.ebi.ac.uk/ena/submit/webin/login)
dashboard with your Webin credentials and access reports about
1. the content of submitted metadata objects
	- _Studies_: `Studies Report`
	- _Samples_: `Samples Report`
	- Reads (_Experiments_ and _Runs_): `Runs Report`
	- _Analyses_: `Analyses Report`
1. the file content of _Run_ and _Analysis_ objects (the only two object types
	which have data files associated with them rather than just metadata):
	`Run Files Report` and `Analysis Files Report`
1. files which have been uploaded but not submitted yet:
	`Unsubmitted Files Report`
1. the post-archival processing status of submitted data files:
	`Run Processing Report` and `Analysis Processing Report`
{{< hint info >}}
__INFO__  
Note that while this interface allows you to check the processing status of your
files, in cases where there are failures you may not have the ability to fix it
as a user; instead you will most likely need to contact the ENA
[helpdesk](https://www.ebi.ac.uk/ena/browser/support).
{{< /hint >}}
