import * as vscode from 'vscode';

import Upsource from './Upsource';
import { ReviewDescriptorDTO } from './models/ReviewDescriptorDTO';
import { ReviewListDTO } from './models/ReviewListDTO';
import { ReviewTreeItem } from './models/ReviewTreeItem';

export default class ReviewsDataProvider implements vscode.TreeDataProvider<ReviewTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ReviewTreeItem | null> = new vscode.EventEmitter<ReviewTreeItem | null>();
    readonly onDidChangeTreeData: vscode.Event<ReviewTreeItem | null> = this
        ._onDidChangeTreeData.event;

    getChildren(element?: ReviewTreeItem): Promise<ReviewTreeItem[]> {
        return new Promise((resolve, reject) => {
            Upsource.getReviewList('state: open').then(
                res => {
                    if (!res.totalCount) return [];

                    let items = res.reviews.map(review => {
                        let title = review.reviewId.reviewId + ` (${review.title})`;
                        return new ReviewTreeItem(title, vscode.TreeItemCollapsibleState.None, review);
                    });
                    resolve(items);
                },
                err => {
                    console.error(err);
                    reject(err);
                }
            );
        });
    }

	getTreeItem(element: ReviewTreeItem): ReviewTreeItem | Promise<ReviewTreeItem> {
        return element;
	}
}