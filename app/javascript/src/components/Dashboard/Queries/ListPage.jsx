import React from "react";
import { NavLink } from "react-router-dom";
import { colorForBinaryRating } from 'common/colorHelper';
import { timeSince } from "common/timeHelper";

export default function ListPage({
  items = [],
  scorer,
  setCurrrentResource,
  showPane
}) {
  return (
    <div className="w-full px-4">
      <table className="nui-table nui-table--checkbox">
        <thead>
          <tr>
            <th className="text-left">Queries</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {items.map(query => (
              <tr key={query.id} className={"cursor-pointer bg-white hover:bg-gray-50"}>
                <td>
                  <NavLink
                    to={`/query_groups/${query.query_group_id}/queries/${query.id}/results`}
                    className="w-full no-underline"
                    activeClassName="active"
                    onClick={e => setCurrrentResource(query) }
                  >
                    <div className="flex flex-row space-x-2 text-gray-900 items-center">
                      <div className="rounded-md text-white text-xl font-extrabold p-2 items-center"
                        style={{backgroundColor: colorForBinaryRating(query.latest_score || 0.0)}}
                      > { (query.latest_score || 0.0).toFixed(2) }
                      </div>
                      <div>
                        {query.query_text}
                      </div>
                      <div className="text-xs text-gray-300">
                        (Updated {timeSince(new Date(query.updated_at))} ago)
                      </div>
                    </div>
                  </NavLink>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
