import React, {useState} from 'react';
import {
  Button,
  Container,
  Header,
  Message,
  Segment,
  Table,
} from 'semantic-ui-react';
import ReactDataSheet from 'react-datasheet';
import Papa from 'papaparse';
import {LogOnMount} from '@amplitude/react-amplitude';

const FilePreview = ({file}) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);

  const getPreview = () => {
    const getData = async () => {
      setLoading(true);
      const resp = await fetch(file.downloadUrl, {
        headers: new Headers({
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        }),
      });
      const contents = await resp.text();

      const parsed = Papa.parse(contents, {
        preview: 100,
        transform: v => ({value: v}),
      });

      setErrors(parsed.errors);
      if (parsed.errors.length > 0) {
        setData(contents.substring(0, 2048));
      } else {
        setData(parsed.data);
      }
      setLoading(false);
    };

    getData();
  };

  return (
    <Container as={Segment} basic vertical>
      <Header as="h4" color="grey">
        File Preview
      </Header>
      <Segment loading={loading} basic className="scroll-container">
        {!data.length && !loading && (
          <Container textAlign="center">
            <Button
              basic
              primary
              labelPosition="left"
              icon="eye"
              content="Preview File"
              onClick={getPreview}
            />
          </Container>
        )}
        {errors.length > 0 && (
          <Message
            warning
            icon="warning sign"
            header="Error parsing file"
            content="The file was not able to be read to provide a formatted preview. File contents are displayed in raw format below for the first 2048 characters."
          />
        )}
        {data.length > 0 && (
          <>
            <LogOnMount eventType="document preview" />
            {errors.length > 0 ? (
              <pre>{data}</pre>
            ) : (
              <ReactDataSheet
                data={data.slice(1)}
                valueRenderer={cell => cell.value}
                sheetRenderer={props => (
                  <Table basic="very" compact="very" singleLine definition>
                    <Table.Header>
                      <Table.Row>
                        {data[0].map((col, i) => (
                          <Table.HeaderCell key={i}>
                            {col.value}
                          </Table.HeaderCell>
                        ))}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>{props.children}</Table.Body>
                  </Table>
                )}
              />
            )}
          </>
        )}
      </Segment>
    </Container>
  );
};

export default FilePreview;
