import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header, SubHeader } from "neetoui/layouts";

import queryGroupService from "apis/queryGroupService";
import queryService from "apis/queryService";
import resultService from "apis/resultService";

import ListPage from "./ListPage";

const QueryResult = ({ setCurrrentQuery, showQueryEditPane }) => {
  let { path, url } = useRouteMatch();
  let urlParams = useParams();

  const [loading, setLoading] = useState(true);
  const [showPane, setShowPane] = useState(false);
  const [currentResource, setCurrrentResource] = useState(false);
  
  const [queryGroup, setQueryGroup] = useState(false);
  const [query, setQuery] = useState(false);
  const [queryResult, setQueryResult] = useState(false);

  useEffect(() => {
    fetchQueryResult();
  }, [url]);

  const fetchQueryResult = async () => {
    try {
      setLoading(true);

      const queryGroupResponse = await queryGroupService.fetch(urlParams.queryGroupId);
      setQueryGroup(queryGroupResponse.data.query_group);


      const queryResponse = await queryService.fetch(urlParams.queryGroupId, urlParams.queryId);
      setQuery(queryResponse.data.query);

      const resultResponse = await resultService.fetchAll(urlParams.queryGroupId, urlParams.queryId);
      setQueryResult(resultResponse.data.result);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refetchResults =  async () => {
    try {
      setLoading(true);
      const resultResponse = await resultService.fetch_fresh_results(urlParams.queryGroupId, urlParams.queryId);
      setQueryResult(resultResponse.data.result);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }
  return (
    <>
      <Header
        title="Results"
        actionBlock={
          <div className="flex flex-row space-x-4">
            <Button
              onClick={() => { setCurrrentQuery(query); showQueryEditPane(true); } }
              label="Edit Query"
              icon="ri-pencil-line"
            />
            <Button
              onClick={() => { refetchResults(); } }
              label="Refetch Results"
              icon="ri-refresh-line"
            />
          </div>
        }
      />
      {queryResult ? (
        <>
          <ListPage
            queryGroup={queryGroup}
            items={queryResult.data}
            setCurrrentResource={setCurrrentResource}
            showPane={setShowPane}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Looks like you don't have any results!"
          subtitle="Query results represent the actual result of query on the source."
          primaryAction={() => refetchResults()}
          primaryActionLabel="Fetch Results From Source"
        />
      )}
    </>
  );
};

export default QueryResult;
